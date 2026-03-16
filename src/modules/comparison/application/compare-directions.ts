import { directionAxes } from "@/shared/kernel/direction";

import type {
  ComparisonDifference,
  ComparisonInput,
  ComparisonResult,
} from "../domain/comparison";

function buildDifferences(input: ComparisonInput): ComparisonDifference[] {
  return directionAxes.map((axis) => ({
    axis,
    values: input.directions.map((direction) => ({
      directionId: direction.id,
      score: direction.axisScores[axis],
    })),
  }));
}

export function compareDirections(input: ComparisonInput): ComparisonResult {
  return {
    directionIds: input.directions.map((direction) => direction.id),
    comparedFields: [
      "programFocus",
      "learningDifficulty",
      "careerPaths",
      "axisScores",
    ],
    differences: buildDifferences(input),
  };
}
