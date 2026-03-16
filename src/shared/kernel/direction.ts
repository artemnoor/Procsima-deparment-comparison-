export const directionAxes = [
  "programming",
  "math",
  "engineering",
  "analytics",
  "ai",
] as const;

export type DirectionAxis = (typeof directionAxes)[number];

export type DirectionAxisScores = Record<DirectionAxis, number>;

export type DirectionSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  programFocus: string | null;
  learningDifficulty: number | null;
};

export type DirectionDetail = DirectionSummary & {
  whatYouLearn: string | null;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  axisScores: DirectionAxisScores;
};
