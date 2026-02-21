/*
  Warnings:

  - You are about to drop the column `memberId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cardId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_memberId_key";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cardId" TEXT,
ADD COLUMN     "identifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "memberId";

-- CreateIndex
CREATE UNIQUE INDEX "Card_identifier_key" ON "Card"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardId_key" ON "Card"("cardId");
