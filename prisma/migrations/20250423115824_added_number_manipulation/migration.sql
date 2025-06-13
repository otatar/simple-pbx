-- CreateTable
CREATE TABLE `NumberManipulation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `type` ENUM('aNumber', 'bNumber') NOT NULL,
    `stripBegin` INTEGER NULL,
    `stripEnd` INTEGER NULL,
    `prepend` VARCHAR(191) NULL,
    `append` VARCHAR(191) NULL,
    `trunkId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NumberManipulation` ADD CONSTRAINT `NumberManipulation_trunkId_fkey` FOREIGN KEY (`trunkId`) REFERENCES `Trunk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
