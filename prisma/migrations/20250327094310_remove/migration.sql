/*
  Warnings:

  - You are about to drop the column `templateId` on the `Extension` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Extension` DROP COLUMN `templateId`,
    ADD COLUMN `email` VARCHAR(191) NULL;
