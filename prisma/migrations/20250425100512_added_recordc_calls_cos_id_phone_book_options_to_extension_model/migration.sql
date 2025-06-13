-- AlterTable
ALTER TABLE `Extension` ADD COLUMN `callRecord` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `language` VARCHAR(191) NULL DEFAULT 'en',
    ADD COLUMN `phoneBook` BOOLEAN NULL DEFAULT true;
