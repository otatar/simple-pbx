-- AlterTable
ALTER TABLE `ps_contacts` ADD COLUMN `qualify_2xx_only` ENUM('off', 'on', 'false', 'true', 'no', 'yes') NULL;

-- CreateTable
CREATE TABLE `ExternalPhonebook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL DEFAULT '',
    `company` VARCHAR(191) NULL DEFAULT '',
    `notes` VARCHAR(191) NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    UNIQUE INDEX `ExternalPhonebook_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
