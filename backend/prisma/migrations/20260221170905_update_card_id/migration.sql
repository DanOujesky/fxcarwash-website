/*
  Warnings:

  - The `cardId` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "cardId",
ADD COLUMN     "cardId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardId_key" ON "Card"("cardId");
