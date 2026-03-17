import type { Prisma } from "@prisma/client";

import type {
  DirectionAxisScores,
  DirectionDetail,
  DirectionLearningContent,
  DirectionSubject,
  DirectionSummary,
  PassingScore,
} from "@/shared/kernel/direction";
import { createPrismaFallbackLearningContent } from "@/modules/learning-content";
import type { RecommendationCandidate } from "@/modules/recommendation";

type PrismaDirectionSummaryRecord = {
  id: string;
  code: string | null;
  slug: string;
  title: string;
  shortDescription: string;
  qualification: string | null;
  department: string | null;
  studyDuration: string | null;
  budgetSeats: number | null;
  paidSeats: number | null;
  tuitionPerYearRub: number | null;
  programFocus: string | null;
  learningDifficulty: number | null;
};

type PrismaDirectionDetailRecord = PrismaDirectionSummaryRecord & {
  whatYouLearn: string | null;
  programDescriptionUrl: string | null;
  curriculumUrl: string | null;
  learningContent: Prisma.JsonValue | null;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  programmingScore: number | null;
  mathScore: number | null;
  engineeringScore: number | null;
  analyticsScore: number | null;
  aiScore: number | null;
  passingScores: Array<{
    year: number;
    budget: Prisma.Decimal | null;
    paid: Prisma.Decimal | null;
  }>;
  subjects: Array<{
    title: string;
    subjectBlock: string | null;
    department: string | null;
    hours: number;
    referenceUrl: string | null;
    sortOrder: number | null;
  }>;
};

function mapDirectionContext(input: PrismaDirectionSummaryRecord) {
  return {
    code: input.code,
    qualification: input.qualification,
    department: input.department,
    studyDuration: input.studyDuration,
    budgetSeats: input.budgetSeats,
    paidSeats: input.paidSeats,
    tuitionPerYearRub: input.tuitionPerYearRub,
  };
}

function mapAxisScores(input: {
  programmingScore: number | null;
  mathScore: number | null;
  engineeringScore: number | null;
  analyticsScore: number | null;
  aiScore: number | null;
}): DirectionAxisScores {
  return {
    programming: input.programmingScore ?? 0,
    math: input.mathScore ?? 0,
    engineering: input.engineeringScore ?? 0,
    analytics: input.analyticsScore ?? 0,
    ai: input.aiScore ?? 0,
  };
}

function isRecord(value: Prisma.JsonValue | null): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function normalizeLearningContent(
  directionId: string,
  value: Prisma.JsonValue | null,
): DirectionLearningContent {
  if (!isRecord(value)) {
    return createPrismaFallbackLearningContent(directionId);
  }

  const summary = value.summary;
  const outcomes = value.outcomes;
  const technologies = value.technologies;
  const practicalSkills = value.practicalSkills;
  const studyFocuses = value.studyFocuses;
  const mvpVisibleFields = value.mvpVisibleFields;
  const deferredFields = value.deferredFields;

  if (
    !Array.isArray(outcomes) ||
    !Array.isArray(technologies) ||
    !Array.isArray(practicalSkills) ||
    !Array.isArray(studyFocuses)
  ) {
    return createPrismaFallbackLearningContent(directionId);
  }

  return {
    summary: summary === null || isString(summary) ? summary : null,
    outcomes: outcomes.filter(isRecord).map((outcome) => ({
      title: isString(outcome.title) ? outcome.title : "Untitled outcome",
      description: isString(outcome.description)
        ? outcome.description
        : "Description pending.",
    })),
    technologies: technologies.filter(isRecord).map((technology) => ({
      name: isString(technology.name) ? technology.name : "Unknown",
      category:
        technology.category === "language" ||
        technology.category === "framework" ||
        technology.category === "tool" ||
        technology.category === "platform" ||
        technology.category === "method"
          ? technology.category
          : "tool",
      context:
        technology.context === null || isString(technology.context)
          ? technology.context
          : null,
    })),
    practicalSkills: practicalSkills.filter(isRecord).map((skill) => ({
      name: isString(skill.name) ? skill.name : "Unknown skill",
      level:
        skill.level === "foundation" ||
        skill.level === "intermediate" ||
        skill.level === "advanced"
          ? skill.level
          : "foundation",
      context:
        skill.context === null || isString(skill.context)
          ? skill.context
          : null,
    })),
    studyFocuses: studyFocuses.filter(isRecord).map((studyFocus) => ({
      title: isString(studyFocus.title)
        ? studyFocus.title
        : "Untitled study focus",
      summary: isString(studyFocus.summary)
        ? studyFocus.summary
        : "Summary pending.",
      subjectBlocks: isStringArray(studyFocus.subjectBlocks)
        ? studyFocus.subjectBlocks
        : [],
      technologies: isStringArray(studyFocus.technologies)
        ? studyFocus.technologies
        : [],
      practicalSkills: isStringArray(studyFocus.practicalSkills)
        ? studyFocus.practicalSkills
        : [],
    })),
    mvpVisibleFields: isStringArray(mvpVisibleFields)
      ? mvpVisibleFields
      : [
          "summary",
          "outcomes",
          "technologies",
          "practicalSkills",
          "studyFocuses",
        ],
    deferredFields: Array.isArray(deferredFields)
      ? deferredFields.filter(isRecord).map((field) => ({
          field: isString(field.field) ? field.field : "unknown",
          reason: isString(field.reason) ? field.reason : "Deferred.",
        }))
      : [],
  };
}

function mapPassingScores(
  input: PrismaDirectionDetailRecord["passingScores"],
): PassingScore[] {
  return [...input]
    .sort((left, right) => left.year - right.year)
    .map((score) => ({
      year: score.year,
      budget: score.budget?.toNumber() ?? null,
      paid: score.paid?.toNumber() ?? null,
    }));
}

function mapSubjects(
  input: PrismaDirectionDetailRecord["subjects"],
): DirectionSubject[] {
  return [...input]
    .sort((left, right) => {
      const leftSort = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const rightSort = right.sortOrder ?? Number.MAX_SAFE_INTEGER;

      return leftSort !== rightSort
        ? leftSort - rightSort
        : left.title.localeCompare(right.title);
    })
    .map((subject) => ({
      title: subject.title,
      subjectBlock: subject.subjectBlock,
      department: subject.department,
      hours: subject.hours,
      referenceUrl: subject.referenceUrl,
    }));
}

function deriveSubjectBlocks(
  subjects: PrismaDirectionDetailRecord["subjects"],
): string[] {
  return [
    ...new Set(
      subjects
        .map((subject) => subject.subjectBlock)
        .filter(
          (subjectBlock): subjectBlock is string =>
            typeof subjectBlock === "string" && subjectBlock.length > 0,
        ),
    ),
  ];
}

export function mapPrismaDirectionToSummary(
  input: PrismaDirectionSummaryRecord,
): DirectionSummary {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    programFocus: input.programFocus,
    learningDifficulty: input.learningDifficulty,
    context: mapDirectionContext(input),
  };
}

export function mapPrismaDirectionToDetail(
  input: PrismaDirectionDetailRecord,
): DirectionDetail {
  return {
    ...mapPrismaDirectionToSummary(input),
    whatYouLearn: input.whatYouLearn,
    learningContent: normalizeLearningContent(input.id, input.learningContent),
    careerPaths: input.careerPaths,
    targetFit: input.targetFit,
    keyDifferences: input.keyDifferences,
    axisScores: mapAxisScores(input),
    passingScores: mapPassingScores(input.passingScores),
    subjects: mapSubjects(input.subjects),
    programDescriptionUrl: input.programDescriptionUrl,
    curriculumUrl: input.curriculumUrl,
  };
}

export function mapPrismaDirectionToRecommendationCandidate(
  input: PrismaDirectionDetailRecord,
): RecommendationCandidate {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    programFocus: input.programFocus,
    learningDifficulty: input.learningDifficulty,
    axisScores: mapAxisScores(input),
    subjectBlocks: deriveSubjectBlocks(input.subjects),
    targetFit: input.targetFit,
    keyDifferences: input.keyDifferences,
    whatYouLearn: input.whatYouLearn,
  };
}
