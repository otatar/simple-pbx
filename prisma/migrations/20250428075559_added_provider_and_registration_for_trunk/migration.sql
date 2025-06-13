/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Trunk` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Trunk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Trunk` ADD COLUMN `provider` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `registration` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Trunk_name_key` ON `Trunk`(`name`);
