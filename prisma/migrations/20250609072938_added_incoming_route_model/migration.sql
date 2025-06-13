-- CreateTable
CREATE TABLE `IncomingRoute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `destinationType` ENUM('extension', 'trunk', 'trunkGroup', 'queue') NOT NULL,
    `trunkId` INTEGER NULL,
    `trunkGroupId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    UNIQUE INDEX `IncomingRoute_prefix_key`(`prefix`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IncomingRoute` ADD CONSTRAINT `IncomingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncomingRoute` ADD CONSTRAINT `IncomingRoute_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
