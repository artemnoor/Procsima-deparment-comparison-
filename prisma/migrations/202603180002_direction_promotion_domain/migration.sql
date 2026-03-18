-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('draft', 'active', 'inactive');

-- CreateTable
CREATE TABLE "DirectionPromotion" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'draft',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "note" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectionPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectionPromotion_directionId_key" ON "DirectionPromotion"("directionId");

-- CreateIndex
CREATE INDEX "DirectionPromotion_status_priority_idx" ON "DirectionPromotion"("status", "priority");

-- CreateIndex
CREATE INDEX "DirectionPromotion_startsAt_endsAt_idx" ON "DirectionPromotion"("startsAt", "endsAt");

-- AddForeignKey
ALTER TABLE "DirectionPromotion" ADD CONSTRAINT "DirectionPromotion_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
