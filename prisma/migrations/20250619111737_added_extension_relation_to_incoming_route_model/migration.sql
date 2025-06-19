-- AlterTable
ALTER TABLE `IncomingRoute` ADD COLUMN `extensionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `IncomingRoute` ADD CONSTRAINT `IncomingRoute_extensionId_fkey` FOREIGN KEY (`extensionId`) REFERENCES `Extension`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
