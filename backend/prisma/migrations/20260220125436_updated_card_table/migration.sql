/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_identifier_key" ON "Card"("identifier");
