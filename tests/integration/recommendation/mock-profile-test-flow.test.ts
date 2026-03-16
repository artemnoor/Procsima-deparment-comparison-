import { describe, expect, it } from "vitest";

import { createRecommendationCandidateRepository } from "@/app/public-direction-data";
import {
  generateProfileTestRecommendations,
  parseProfileTestSubmission,
  profileTestQuestions,
} from "@/modules/recommendation";

describe("mock profile test flow", () => {
  it("resolves mock-backed recommendation candidates and returns a ranked result", async () => {
    process.env.NPS_PUBLIC_DIRECTION_SOURCE = "mock";

    const repository = createRecommendationCandidateRepository();
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

    expect(candidates).toHaveLength(4);
    expect(result.recommendedDirectionIds).toEqual([
      "direction-09-02-07",
      "direction-10-02-05",
      "direction-09-02-01",
    ]);
    expect(result.matches[0]?.confidence).toBe("high");
    expect(result.matches[0]?.explanation.join(" ")).toContain("software");
  });
});
