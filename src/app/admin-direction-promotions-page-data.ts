import { prisma } from "@/app/db";
import {
  PrismaDirectionPromotionRepository,
  getDirectionPromotions,
} from "@/modules/admin";
import { logWithLevel } from "@/shared/utils/logging";

export async function loadAdminDirectionPromotionsPageData() {
  const repository = new PrismaDirectionPromotionRepository(prisma);

  logWithLevel(
    "admin-direction-promotions-page-data",
    "info",
    "Loading direction promotion admin page data.",
    {
      source: "prisma",
    },
  );

  const [promotions, directionOptions] = await Promise.all([
    getDirectionPromotions(repository, {}),
    repository.listPromotionDirectionOptions(),
  ]);

  return {
    promotions,
    directionOptions,
  };
}
