import { describe, expect, it } from "vitest";

import {
  MockDirectionComparisonRepository,
  getComparisonPageData,
} from "@/modules/comparison";

describe("mock comparison flow", () => {
  it("resolves a ready comparison page state from the mock-backed repository", async () => {
    const repository = new MockDirectionComparisonRepository();

    const result = await getComparisonPageData(repository, {
      ids: ["direction-09-02-01", "direction-10-02-05"],
      source: "catalog",
    });

    expect(result.state).toBe("ready");
    expect(result.directions).toHaveLength(2);
    expect(result.comparison?.differences).toHaveLength(5);
    expect(result.comparison?.comparedFields).toContain("axisScores");
  });
});
