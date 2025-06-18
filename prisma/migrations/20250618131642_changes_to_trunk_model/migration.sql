-- DropForeignKey
ALTER TABLE `IncomingRoute` DROP FOREIGN KEY `IncomingRoute_trunkId_fkey`;

-- DropForeignKey
ALTER TABLE `NumberManipulation` DROP FOREIGN KEY `NumberManipulation_trunkId_fkey`;

-- DropIndex
DROP INDEX `IncomingRoute_trunkId_fkey` ON `IncomingRoute`;

-- DropIndex
DROP INDEX `NumberManipulation_trunkId_fkey` ON `NumberManipulation`;

-- AddForeignKey
ALTER TABLE `IncomingRoute` ADD CONSTRAINT `IncomingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NumberManipulation` ADD CONSTRAINT `NumberManipulation_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
