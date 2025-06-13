-- AlterTable
ALTER TABLE `Extension` ADD COLUMN `cosId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Extension` ADD CONSTRAINT `Extension_cosId_fkey` FOREIGN KEY (`cosId`) REFERENCES `ClassOfService`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
