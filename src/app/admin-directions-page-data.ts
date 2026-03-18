import { prisma } from "@/app/db";
import {
  PrismaDirectionContentRepository,
  getAdminDirections,
} from "@/modules/admin";
import { logWithLevel } from "@/shared/utils/logging";

export async function loadAdminDirectionsPageData() {
  const repository = new PrismaDirectionContentRepository(prisma);

  logWithLevel(
    "admin-directions-page-data",
    "info",
    "Loading editable directions for admin page.",
    {
      source: "prisma",
    },
  );

  return {
    directions: await getAdminDirections(repository),
  };
}
