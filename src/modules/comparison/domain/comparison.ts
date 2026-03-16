import type { DirectionAxis, DirectionDetail } from "@/shared/kernel/direction";

export const mvpComparisonFields = [
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
] as const;

export const deferredComparisonSourceFields = [
  "rawSubjects",
  "normalizedCurriculumTaxonomy",
  "departmentOwnershipGraph",
  "semesterDistribution",
  "realDbIdentifiers",
] as const;

export type ComparisonField = (typeof mvpComparisonFields)[number];

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
  comparedFields: ComparisonField[];
  differences: ComparisonDifference[];
};
