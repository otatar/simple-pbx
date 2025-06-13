/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `NumberManipulation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `NumberManipulation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `NumberManipulation` ADD COLUMN `priority` INTEGER NOT NULL DEFAULT 1,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `NumberManipulation_name_key` ON `NumberManipulation`(`name`);
