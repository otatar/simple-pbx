/*
  Warnings:

  - You are about to alter the column `callRecord` on the `Extension` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.
  - You are about to alter the column `phoneBook` on the `Extension` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Extension` MODIFY `callRecord` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    MODIFY `phoneBook` ENUM('yes', 'no') NULL DEFAULT 'yes';
