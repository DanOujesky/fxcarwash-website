/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_number_key" ON "Card"("number");
