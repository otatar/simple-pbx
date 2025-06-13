-- CreateTable
CREATE TABLE `TrunkGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trunk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,
    `trunkGroupId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutgoingRoute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `destinationType` ENUM('local', 'trunk', 'trunkGroup', 'queue') NOT NULL,
    `trunkId` INTEGER NOT NULL,
    `trunkGroupId` INTEGER NOT NULL,
    `cosId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    UNIQUE INDEX `OutgoingRoute_prefix_key`(`prefix`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassOfService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `cos` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trunk` ADD CONSTRAINT `Trunk_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingRoute` ADD CONSTRAINT `OutgoingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingRoute` ADD CONSTRAINT `OutgoingRoute_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingRoute` ADD CONSTRAINT `OutgoingRoute_cosId_fkey` FOREIGN KEY (`cosId`) REFERENCES `ClassOfService`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
