/*
  Warnings:

  - Added the required column `contactType` to the `ExternalPhonebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExternalPhonebook` ADD COLUMN `contactType` ENUM('mobile', 'landline', 'satellite') NOT NULL DEFAULT 'mobile';
UPDATE `ExternalPhonebook` SET `contactType` = 'mobile' WHERE `contactType` IS NULL;
ALTER TABLE `ExternalPhonebook` MODIFY `contactType` ENUM('mobile', 'landline', 'satellite') NOT NULL;
