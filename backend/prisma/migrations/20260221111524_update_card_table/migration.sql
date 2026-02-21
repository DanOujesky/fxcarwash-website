/*
  Warnings:

  - You are about to drop the column `identifier` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `CreditLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Card_identifier_key";

-- DropIndex
DROP INDEX "CreditLog_memberId_idx";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "CreditLog" DROP COLUMN "memberId";
