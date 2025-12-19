/*
  Warnings:

  - You are about to drop the column `image` on the `News` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "image",
ADD COLUMN     "imagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpiration" TIMESTAMP(3);
