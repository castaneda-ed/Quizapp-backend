const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      /**
       * creates a new user and hases the password
       * @param {string} email
       * @param {string} pasword
       * @param {string} name
       * @param {string} lastname
       * @returns The new user
       */
      async register(email, password, firstname, lastname) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.user.create({
            data: { email, hashedPassword, firstname, lastname },
          });
          return user;
        } catch (e) {
          if (e.code === "P2002") {
            throw new Error("email already exists");
          }
          throw e;
        }
      },
      /**
       * Validates the credentials against User the database to log in the user
       * @param {string} email
       * @param {string} password
       * @returns Logged in user
       */
      async login(email, password) {
        try {
          const user = await prisma.user.findUniqueOrThrow({
            where: { email },
          });
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error("Wrong Password");
          }
          return user;
        } catch (e) {
          throw e;
        }
      },
      /**
       * Takes the current password as validation and then changes it to a new (hashed) password
       * @param {string} id
       * @param {string} currentPassword
       * @param {string} newPassword
       * @returns The user with the new password
       */
      async updatePassword(id, currentPassword, newPassword) {
        try {
          const user = await prisma.user.findUniqueOrThrow({
            where: { id },
          });
          const valid = await bcrypt.compare(currentPassword, user.password);
          if (!valid) {
            throw new Error("The password you entered is incorrect");
          }
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          const updatedUser = await prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword },
          });
          return updatedUser;
        } catch (e) {
          throw e;
        }
      },
    },
  },
});

module.exports = prisma;
