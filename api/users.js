const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { authenticate } = require("./auth");

module.exports = router;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Get all users
router.get("/", authenticate, async (req, res, next) => {
  try {
    const users = await prisma.user.finMany();
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//Get loggged in user
router.get("/me", authenticate, async (req, rex, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
      include: { quizzes: true },
    });
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

//Ger user by id
router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return next({
      status: 400,
      message: "Invalid user Id",
    });
  }
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
      include: { quizzes: true },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//Change current user info
router.patch("/me", authenticate, async (res, res, next) => {
  const { email, firstname, lastname, profilePicture, age } = req.body;

  // Email check validation
  if (email !== undefined) {
    if (email.trim() === "") {
      return next({
        status: 400,
        message: "email cannot be empty.",
      });
    }

    if (email.includes(" ")) {
      return next({ status: 400, message: "Email cannot be empty" });
    }

    if (!emailRegex.test(email)) {
      return next({ status: 400, message: "Email format is invalid." });
    }
  }

  // Firstname check validation
  if (firstname !== undefined) {
    if (firstname.trim() === "") {
      return next({
        status: 400,
        message: "Firstname cannot be empty.",
      });
    }
  }

  // Lastname check validation
  if (lastname !== undefined) {
    if (lastname.trim() === "") {
      return next({
        status: 400,
        message: "Lastname cannot be empty.",
      });
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        email,
        firstname,
        lastname,
        profilePicture,
        age,
      },
    });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//DELETE current logged in user
router.delete("/me", authenticate, async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//Patch the currnet logged in user password
router.patch("/me/password", authenticate, async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next({
      status: 400,
      message: "Include both current and new password",
    });
  }

  try {
    const updatedUser = await prisma.user.updatePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.status(200).json({ message: "Succesfully updated password" });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
