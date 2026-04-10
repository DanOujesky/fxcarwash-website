-- CreateTable
CREATE TABLE "CardWaitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardWaitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardWaitlist_email_key" ON "CardWaitlist"("email");

-- CreateIndex
CREATE INDEX "CardWaitlist_email_idx" ON "CardWaitlist"("email");
