-- AlterTable
ALTER TABLE `Trunk` ADD COLUMN `clientUri` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `host` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `port` INTEGER NULL DEFAULT 5060,
    ADD COLUMN `serverUri` VARCHAR(191) NULL DEFAULT '';
