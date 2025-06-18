-- DropForeignKey
ALTER TABLE `IncomingRoute` DROP FOREIGN KEY `IncomingRoute_trunkId_fkey`;

-- DropIndex
DROP INDEX `IncomingRoute_trunkId_fkey` ON `IncomingRoute`;

-- AddForeignKey
ALTER TABLE `IncomingRoute` ADD CONSTRAINT `IncomingRoute_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
