/*
  Warnings:

  - The values [local] on the enum `OutgoingRoute_destinationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `OutgoingRoute` MODIFY `destinationType` ENUM('extension', 'trunk', 'trunkGroup', 'queue') NOT NULL;
