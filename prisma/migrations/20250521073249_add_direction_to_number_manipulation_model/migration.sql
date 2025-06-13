-- AlterTable
ALTER TABLE `NumberManipulation` ADD COLUMN `direction` ENUM('inbound', 'outbound') NOT NULL DEFAULT 'inbound';
