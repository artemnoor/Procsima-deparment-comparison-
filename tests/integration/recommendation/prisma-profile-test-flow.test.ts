import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  PrismaRecommendationCandidateRepository,
  generateProfileTestRecommendations,
  parseProfileTestSubmission,
  profileTestQuestions,
} from "@/modules/recommendation";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("prisma profile test flow", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("resolves recommendation candidates with subject-block signals from Prisma", async () => {
    const repository = new PrismaRecommendationCandidateRepository(
      integrationPrisma,
    );
    const candidates = await repository.listCandidates();
    const parsedSubmission = parseProfileTestSubmission(profileTestQuestions, {
      motivation: "build-products",
      activities: ["write-code", "work-with-data"],
      outcome: "launch-products",
    });
    const result = generateProfileTestRecommendations(
      parsedSubmission,
      candidates,
    );

    expect(candidates).toHaveLength(2);
    expect(candidates[0]?.subjectBlocks.length).toBeGreaterThan(0);
    expect(candidates.find((candidate) => candidate.id === "direction-09-02-07"))
      .toMatchObject({
        subjectBlocks: expect.arrayContaining(["Программирование"]),
      });
    expect(result.recommendedDirectionIds[0]).toBe("direction-09-02-07");
    expect(result.matches[0]?.confidence).toBe("high");
  });
});
