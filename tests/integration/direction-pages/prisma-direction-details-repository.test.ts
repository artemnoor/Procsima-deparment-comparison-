import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaDirectionDetailsRepository } from "@/modules/direction-pages";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaDirectionDetailsRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("returns a direction detail with mapped axis scores", async () => {
    const repository = new PrismaDirectionDetailsRepository(integrationPrisma);

    const direction = await repository.findDirectionBySlug(
      "software-engineering",
    );

    expect(direction).not.toBeNull();
    expect(direction?.slug).toBe("software-engineering");
    expect(direction?.axisScores.programming).toBe(5);
    expect(direction?.careerPaths).toContain("Software Engineer");
  });
});
