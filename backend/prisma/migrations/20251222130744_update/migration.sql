/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "credit" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Card_number_key" ON "Card"("number");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "Card"("userId");
