import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  getAdmissionsDashboard,
  PrismaAdmissionsDashboardRepository,
} from "@/modules/admin";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaAdmissionsDashboardRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();

    await integrationPrisma.event.createMany({
      data: [
        {
          type: "page_opened",
          userId: "dev-admin-user",
          payload: {
            route: "/directions",
            contour: "public",
            source: "page",
          },
        },
        {
          type: "direction_opened",
          userId: "dev-admin-user",
          directionId: "direction-09-02-07",
          payload: {
            slug: "program-09-02-07",
            route: "/directions/program-09-02-07",
          },
        },
        {
          type: "compare_started",
          userId: "dev-admin-user",
          payload: {
            directionIds: ["direction-09-02-07", "direction-10-02-05"],
            source: "catalog",
          },
        },
        {
          type: "comparison_run",
          userId: "dev-admin-user",
          payload: {
            directionIds: ["direction-09-02-07", "direction-10-02-05"],
            comparedFields: ["code", "budgetSeats"],
          },
        },
        {
          type: "recommendation_generated",
          userId: "dev-admin-user",
          payload: {
            directionIds: ["direction-09-02-07"],
            explanation: "Programming-heavy path",
            sourceRoute: "/profile-test",
            dominantAxes: ["programming", "analytics"],
          },
        },
      ],
    });
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("builds summary metrics and top directions from persisted events", async () => {
    const repository = new PrismaAdmissionsDashboardRepository(
      integrationPrisma,
    );

    const dashboard = await getAdmissionsDashboard(repository, {
      days: "30",
      limit: "5",
    });

    expect(dashboard.summary).toEqual({
      totalEvents: 5,
      pageOpens: 1,
      directionOpens: 1,
      compareStarts: 1,
      comparisonRuns: 1,
      recommendationsGenerated: 1,
    });

    expect(dashboard.topDirections).toHaveLength(2);
    expect(dashboard.topDirections[0]).toMatchObject({
      directionId: "direction-09-02-07",
      slug: "program-09-02-07",
      interactionCount: 4,
      breakdown: {
        directionOpens: 1,
        compareStarts: 1,
        comparisonRuns: 1,
        recommendationsGenerated: 1,
      },
    });
    expect(dashboard.topDirections[1]).toMatchObject({
      directionId: "direction-10-02-05",
      slug: "program-10-02-05",
      interactionCount: 2,
      breakdown: {
        directionOpens: 0,
        compareStarts: 1,
        comparisonRuns: 1,
        recommendationsGenerated: 0,
      },
    });
  });
});
