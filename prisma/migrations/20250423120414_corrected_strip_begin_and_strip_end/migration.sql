/*
  Warnings:

  - Made the column `stripBegin` on table `NumberManipulation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `NumberManipulation` MODIFY `stripBegin` INTEGER NOT NULL DEFAULT 0,
    MODIFY `stripEnd` INTEGER NULL DEFAULT 0;
