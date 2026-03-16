import type { DirectionLearningContent } from "@/shared/kernel/direction";

export type DirectionContent = {
  directionId: string;
  whatYouLearn: string | null;
  learningContent: DirectionLearningContent;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
};
