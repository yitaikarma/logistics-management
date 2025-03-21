-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_warehouseId_fkey`;

-- DropIndex
DROP INDEX `Inventory_warehouseId_commodityId_key` ON `Inventory`;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
