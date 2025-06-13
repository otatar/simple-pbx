-- CreateTable
CREATE TABLE `Cdr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `duration` INTEGER NULL DEFAULT 0,
    `dialStatus` VARCHAR(191) NULL DEFAULT '',
    `origANumber` VARCHAR(80) NULL DEFAULT '',
    `origBNumber` VARCHAR(80) NULL DEFAULT '',
    `manANumber` VARCHAR(80) NULL DEFAULT '',
    `manBNumber` VARCHAR(80) NULL DEFAULT '',
    `sourceType` VARCHAR(80) NULL DEFAULT '',
    `destinationType` VARCHAR(80) NULL DEFAULT '',
    `sourceTrunk` VARCHAR(80) NULL DEFAULT '',
    `destinationTrunk` VARCHAR(80) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
