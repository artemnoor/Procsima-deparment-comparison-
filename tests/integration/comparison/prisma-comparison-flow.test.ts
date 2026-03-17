import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  PrismaDirectionComparisonRepository,
  getComparisonPageData,
} from "@/modules/comparison";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("prisma comparison flow", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("resolves a ready comparison state with persisted rich direction payloads", async () => {
    const repository = new PrismaDirectionComparisonRepository(integrationPrisma);

    const result = await getComparisonPageData(repository, {
      ids: ["direction-09-02-07", "direction-10-02-05"],
      source: "catalog",
    });

    expect(result.state).toBe("ready");
    expect(result.directions).toHaveLength(2);
    expect(result.directions[0]?.context.code).toBe("09.02.07");
    expect(result.directions[0]?.subjects).toHaveLength(2);
    expect(result.directions[1]?.passingScores).toHaveLength(2);
    expect(result.comparison?.differences).toHaveLength(5);
  });
});
