/*
  Warnings:

  - A unique constraint covering the columns `[orderFullNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderIdentifier]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderFullNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderIdentifier` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumberCount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderFullNumber" TEXT NOT NULL,
ADD COLUMN     "orderIdentifier" INTEGER NOT NULL,
ADD COLUMN     "orderNumberCount" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderFullNumber_key" ON "Order"("orderFullNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderIdentifier_key" ON "Order"("orderIdentifier");
