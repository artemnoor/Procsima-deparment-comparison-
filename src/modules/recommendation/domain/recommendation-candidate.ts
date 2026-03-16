import type { DirectionAxisScores } from "@/shared/kernel/direction";

export type RecommendationCandidate = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  programFocus: string | null;
  learningDifficulty: number | null;
  axisScores: DirectionAxisScores;
  subjectBlocks: string[];
  targetFit: string | null;
  keyDifferences: string[];
  whatYouLearn: string | null;
};
