/*
  Warnings:

  - You are about to drop the column `trunkGroupId` on the `Trunk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Trunk` DROP FOREIGN KEY `Trunk_trunkGroupId_fkey`;

-- DropIndex
DROP INDEX `Trunk_trunkGroupId_fkey` ON `Trunk`;

-- AlterTable
ALTER TABLE `Trunk` DROP COLUMN `trunkGroupId`;

-- CreateTable
CREATE TABLE `_TrunkToTrunkGroup` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TrunkToTrunkGroup_AB_unique`(`A`, `B`),
    INDEX `_TrunkToTrunkGroup_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TrunkToTrunkGroup` ADD CONSTRAINT `_TrunkToTrunkGroup_A_fkey` FOREIGN KEY (`A`) REFERENCES `Trunk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TrunkToTrunkGroup` ADD CONSTRAINT `_TrunkToTrunkGroup_B_fkey` FOREIGN KEY (`B`) REFERENCES `TrunkGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
