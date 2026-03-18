import { prisma } from "@/app/db";
import {
  PrismaDirectionPromotionRepository,
  getDirectionPromotions,
} from "@/modules/admin";
import { logWithLevel } from "@/shared/utils/logging";

export async function loadDirectionPromotions(
  rawFilters: Record<string, string | string[] | undefined> = {},
) {
  logWithLevel(
    "direction-promotions-data",
    "info",
    "Creating direction promotion repository for internal contour.",
    {
      source: "prisma",
    },
  );

  return getDirectionPromotions(
    new PrismaDirectionPromotionRepository(prisma),
    rawFilters,
  );
}
