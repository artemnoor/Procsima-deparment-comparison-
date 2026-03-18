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

  it("returns a direction detail with rich persisted applicant data", async () => {
    const repository = new PrismaDirectionDetailsRepository(integrationPrisma);

    const direction = await repository.findDirectionBySlug("program-09-02-07");

    expect(direction).not.toBeNull();
    expect(direction?.slug).toBe("program-09-02-07");
    expect(direction?.axisScores.programming).toBe(5);
    expect(direction?.careerPaths).toContain("Software Engineer");
    expect(direction?.context.department).toBe(
      "Кафедра программирования и информационных систем",
    );
    expect(direction?.learningContent.summary).toContain(
      "Students build software products",
    );
    expect(direction?.learningContent.deferredFields).toEqual([]);
    expect(direction?.subjects).toHaveLength(2);
    expect(direction?.subjects[0]?.subjectBlock).toBe("Программирование");
    expect(direction?.passingScores).toHaveLength(2);
    expect(direction?.programDescriptionUrl).toContain("/09-02-07/description");
  });
});
