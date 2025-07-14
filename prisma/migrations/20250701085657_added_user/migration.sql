/*
  Warnings:

  - You are about to drop the `ExtensionTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ExtensionTemplate`;

-- CreateTable
CREATE TABLE `WebUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    `lastName` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `passwordChanged` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `WebUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
