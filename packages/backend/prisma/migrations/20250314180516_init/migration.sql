/*
  Warnings:

  - You are about to alter the column `key` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `UnsignedTinyInt`.

*/
-- AlterTable
ALTER TABLE `Role` MODIFY `key` TINYINT UNSIGNED NOT NULL;
