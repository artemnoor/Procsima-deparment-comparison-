import { prisma } from "@/app/db";
import {
  getAdmissionsDashboard,
  PrismaAdmissionsDashboardRepository,
  type AdmissionsDashboardRawFilters,
} from "@/modules/admin";
import { logWithLevel } from "@/shared/utils/logging";

export async function loadAdmissionsDashboard(
  rawFilters: AdmissionsDashboardRawFilters,
) {
  logWithLevel(
    "admissions-dashboard-data",
    "info",
    "Creating admissions dashboard repository for internal contour.",
    {
      source: "prisma",
    },
  );

  return getAdmissionsDashboard(
    new PrismaAdmissionsDashboardRepository(prisma),
    rawFilters,
  );
}
