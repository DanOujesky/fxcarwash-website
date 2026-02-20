-- CreateTable
CREATE TABLE "CreditLog" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditLog_cardId_idx" ON "CreditLog"("cardId");

-- CreateIndex
CREATE INDEX "CreditLog_orderId_idx" ON "CreditLog"("orderId");

-- AddForeignKey
ALTER TABLE "CreditLog" ADD CONSTRAINT "CreditLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
