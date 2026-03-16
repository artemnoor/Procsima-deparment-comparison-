import type { DirectionAxis, DirectionDetail } from "@/shared/kernel/direction";

export type ComparisonInput = {
  directions: DirectionDetail[];
};

export type ComparisonDifference = {
  axis: DirectionAxis;
  values: Array<{
    directionId: string;
    score: number;
  }>;
};

export type ComparisonResult = {
  directionIds: string[];
  comparedFields: Array<
    "programFocus" | "learningDifficulty" | "careerPaths" | "axisScores"
  >;
  differences: ComparisonDifference[];
};
