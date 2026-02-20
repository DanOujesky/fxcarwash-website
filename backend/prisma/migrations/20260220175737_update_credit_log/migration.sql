/*
  Warnings:

  - Added the required column `memberId` to the `CreditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CreditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderId` on table `CreditLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CreditLog" ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "orderId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "CreditLog_memberId_idx" ON "CreditLog"("memberId");
