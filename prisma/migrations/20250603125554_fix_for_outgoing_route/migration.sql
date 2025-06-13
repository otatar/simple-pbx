-- DropForeignKey
ALTER TABLE `OutgoingRoute` DROP FOREIGN KEY `OutgoingRoute_trunkGroupId_fkey`;

-- DropForeignKey
ALTER TABLE `OutgoingRoute` DROP FOREIGN KEY `OutgoingRoute_trunkId_fkey`;

-- DropIndex
DROP INDEX `OutgoingRoute_trunkGroupId_fkey` ON `OutgoingRoute`;

-- DropIndex
DROP INDEX `OutgoingRoute_trunkId_fkey` ON `OutgoingRoute`;

-- AlterTable
ALTER TABLE `OutgoingRoute` MODIFY `trunkId` INTEGER NULL,
    MODIFY `trunkGroupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OutgoingRoute` ADD CONSTRAINT `OutgoingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingRoute` ADD CONSTRAINT `OutgoingRoute_trunkGroupId_fkey` FOREIGN KEY (`trunkGroupId`) REFERENCES `TrunkGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
