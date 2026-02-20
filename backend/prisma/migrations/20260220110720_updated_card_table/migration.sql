-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('IN_STOCK', 'ASSIGNED', 'BLOCKED', 'LOST');

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'IN_STOCK',
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
