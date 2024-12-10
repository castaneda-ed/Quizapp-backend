/*
  Warnings:

  - You are about to drop the column `lenguage` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "lenguage",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English';
