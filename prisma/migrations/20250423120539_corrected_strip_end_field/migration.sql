/*
  Warnings:

  - Made the column `stripEnd` on table `NumberManipulation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `NumberManipulation` MODIFY `stripEnd` INTEGER NOT NULL DEFAULT 0;
