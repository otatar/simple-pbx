-- CreateTable
CREATE TABLE `GlobalSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ringTimeout` INTEGER NULL DEFAULT 40,
    `maxCallDuration` INTEGER NULL DEFAULT 18000,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
