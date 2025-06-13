-- AlterTable
ALTER TABLE `Extension` ALTER COLUMN `cosId` DROP DEFAULT,
    MODIFY `callRecord` ENUM('yes', 'no') NULL DEFAULT 'no';
