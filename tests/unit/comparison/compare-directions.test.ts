import { compareDirections } from "@/modules/comparison";

import { buildDirectionDetail } from "../fixtures/directions";

describe("compareDirections", () => {
  it("returns compared direction ids and field list", () => {
    const result = compareDirections({
      directions: [
        buildDirectionDetail({ id: "direction-1" }),
        buildDirectionDetail({
          id: "direction-2",
          slug: "data-analytics",
          title: "Data Analytics",
          axisScores: {
            programming: 3,
            math: 4,
            engineering: 1,
            analytics: 5,
            ai: 3,
          },
        }),
      ],
    });

    expect(result.directionIds).toEqual(["direction-1", "direction-2"]);
    expect(result.comparedFields).toEqual([
      "programFocus",
      "learningDifficulty",
      "qualification",
      "department",
      "studyDuration",
      "tuitionPerYearRub",
      "passingScores",
      "subjectBlocks",
      "learningOutcomes",
      "technologyHighlights",
      "practicalSkills",
      "studyFocuses",
      "careerPaths",
      "axisScores",
    ]);
  });

  it("builds one difference entry per axis", () => {
    const result = compareDirections({
      directions: [buildDirectionDetail()],
    });

    expect(result.differences).toHaveLength(5);
    expect(result.differences[0]).toEqual({
      axis: "programming",
      values: [{ directionId: "direction-1", score: 5 }],
    });
  });
});
