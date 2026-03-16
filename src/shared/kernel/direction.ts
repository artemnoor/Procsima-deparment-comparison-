import { z } from "zod";

export const directionAxes = [
  "programming",
  "math",
  "engineering",
  "analytics",
  "ai",
] as const;

export type DirectionAxis = (typeof directionAxes)[number];

export type DirectionAxisScores = Record<DirectionAxis, number>;

export const directionTechnologyCategories = [
  "language",
  "framework",
  "tool",
  "platform",
  "method",
] as const;

export type DirectionTechnologyCategory =
  (typeof directionTechnologyCategories)[number];

export const practicalSkillLevels = [
  "foundation",
  "intermediate",
  "advanced",
] as const;

export type PracticalSkillLevel = (typeof practicalSkillLevels)[number];

export type DirectionLearningOutcome = {
  title: string;
  description: string;
};

export type DirectionTechnology = {
  name: string;
  category: DirectionTechnologyCategory;
  context: string | null;
};

export type DirectionPracticalSkill = {
  name: string;
  level: PracticalSkillLevel;
  context: string | null;
};

export type DirectionStudyFocus = {
  title: string;
  summary: string;
  subjectBlocks: string[];
  technologies: string[];
  practicalSkills: string[];
};

export type DeferredLearningContentField = {
  field: string;
  reason: string;
};

export type DirectionLearningContent = {
  summary: string | null;
  outcomes: DirectionLearningOutcome[];
  technologies: DirectionTechnology[];
  practicalSkills: DirectionPracticalSkill[];
  studyFocuses: DirectionStudyFocus[];
  mvpVisibleFields: string[];
  deferredFields: DeferredLearningContentField[];
};

export const passingScoreSchema = z.object({
  year: z.number().int().positive(),
  budget: z.number().nonnegative().nullable(),
  paid: z.number().nonnegative().nullable(),
});

export type PassingScore = z.infer<typeof passingScoreSchema>;

export const directionSubjectSchema = z.object({
  title: z.string().min(1),
  subjectBlock: z.string().min(1).nullable(),
  department: z.string().min(1).nullable(),
  hours: z.number().int().nonnegative(),
  referenceUrl: z.string().url().nullable(),
});

export type DirectionSubject = z.infer<typeof directionSubjectSchema>;

export const rawDirectionSourceSchema = z.object({
  "\u043a\u043e\u0434": z.string().min(1),
  "\u043d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435_\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438":
    z.string().min(1),
  "\u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f": z
    .string()
    .min(1)
    .nullable(),
  "\u043a\u0430\u0444\u0435\u0434\u0440\u0430": z.string().min(1).nullable(),
  "\u043d\u043e\u0440\u043c\u0430\u0442\u0438\u0432\u043d\u044b\u0439_\u0441\u0440\u043e\u043a_\u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f":
    z.string().min(1).nullable(),
  "\u043a\u0440\u0430\u0442\u043a\u043e\u0435_\u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435":
    z.string().min(1),
  "\u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e_\u0431\u044e\u0434\u0436\u0435\u0442\u043d\u044b\u0445_\u043c\u0435\u0441\u0442":
    z.number().int().nonnegative().nullable(),
  "\u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e_\u043f\u043b\u0430\u0442\u043d\u044b\u0445_\u043c\u0435\u0441\u0442":
    z.number().int().nonnegative().nullable(),
  "\u043f\u0440\u043e\u0445\u043e\u0434\u043d\u043e\u0439_\u0431\u0430\u043b\u043b_\u0430\u0442\u0442\u0435\u0441\u0442\u0430\u0442\u0430_\u043f\u043e_\u043f\u0440\u043e\u0448\u043b\u044b\u043c_\u0433\u043e\u0434\u0430\u043c":
    z
      .array(
        z.object({
          "\u0433\u043e\u0434": z.number().int().positive(),
          "\u0431\u044e\u0434\u0436\u0435\u0442": z
            .number()
            .nonnegative()
            .nullable(),
          "\u043f\u043b\u0430\u0442\u043d\u043e\u0435": z
            .number()
            .nonnegative()
            .nullable(),
        }),
      )
      .default([]),
  "\u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c_\u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f_\u0432_\u0433\u043e\u0434_\u0440\u0443\u0431":
    z.number().int().nonnegative().nullable(),
  "\u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435_\u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439_\u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0439_\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0439_\u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b":
    z.string().url().nullable(),
  "\u0441\u0441\u044b\u043b\u043a\u0430_\u043d\u0430_\u0443\u0447\u0435\u0431\u043d\u044b\u0439_\u043f\u043b\u0430\u043d":
    z.string().url().nullable(),
  "\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b": z
    .array(
      z.object({
        "\u043f\u0440\u0435\u0434\u043c\u0435\u0442": z.string().min(1),
        "\u0431\u043b\u043e\u043a_\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430":
          z.string().min(1).nullable(),
        "\u043a\u0430\u0444\u0435\u0434\u0440\u0430_\u043f\u0440\u0435\u043f\u043e\u0434\u0430\u044e\u0449\u0430\u044f_\u043f\u0440\u0435\u0434\u043c\u0435\u0442":
          z.string().min(1).nullable(),
        "\u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e_\u0447\u0430\u0441\u043e\u0432_\u0443_\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430":
          z.number().int().nonnegative(),
        "\u0441\u0441\u044b\u043b\u043a\u0430_\u043d\u0430_\u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e_\u043e_\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0435":
          z.string().url().nullable(),
      }),
    )
    .default([]),
});

export type RawDirectionSourceRecord = z.infer<typeof rawDirectionSourceSchema>;

export type DirectionCatalogContext = {
  code: string | null;
  qualification: string | null;
  department: string | null;
  studyDuration: string | null;
  budgetSeats: number | null;
  paidSeats: number | null;
  tuitionPerYearRub: number | null;
};

export type DirectionSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  programFocus: string | null;
  learningDifficulty: number | null;
  context: DirectionCatalogContext;
};

export type DirectionDetail = DirectionSummary & {
  whatYouLearn: string | null;
  learningContent: DirectionLearningContent;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  axisScores: DirectionAxisScores;
  passingScores: PassingScore[];
  subjects: DirectionSubject[];
  programDescriptionUrl: string | null;
  curriculumUrl: string | null;
};
