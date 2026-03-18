import type { Prisma } from "@prisma/client";

export class DirectionContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectionContentValidationError";
  }
}

export class DirectionContentNotFoundError extends Error {
  constructor(directionId: string) {
    super(`Direction not found: ${directionId}`);
    this.name = "DirectionContentNotFoundError";
  }
}

export type AdminDirectionPassingScore = {
  year: number;
  budget: string;
  paid: string;
};

export type AdminDirectionSubject = {
  title: string;
  subjectBlock: string;
  department: string;
  hours: number;
  referenceUrl: string;
  sortOrder: number;
};

export type AdminDirectionRecord = {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string;
  qualification: string;
  department: string;
  studyDuration: string;
  budgetSeats: number;
  paidSeats: number;
  tuitionPerYearRub: number;
  programFocus: string;
  whatYouLearn: string;
  programDescriptionUrl: string;
  curriculumUrl: string;
  learningContent: Prisma.JsonValue | null;
  careerPaths: string[];
  targetFit: string;
  keyDifferences: string[];
  programmingScore: number;
  mathScore: number;
  engineeringScore: number;
  analyticsScore: number;
  aiScore: number;
  learningDifficulty: number;
  passingScores: AdminDirectionPassingScore[];
  subjects: AdminDirectionSubject[];
};

export type AdminDirectionRawInput = {
  id?: string;
  code?: string;
  slug?: string;
  title?: string;
  shortDescription?: string;
  qualification?: string;
  department?: string;
  studyDuration?: string;
  budgetSeats?: number | string;
  paidSeats?: number | string;
  tuitionPerYearRub?: number | string;
  programFocus?: string;
  whatYouLearn?: string;
  programDescriptionUrl?: string;
  curriculumUrl?: string;
  learningContent?: unknown;
  careerPaths?: string[];
  targetFit?: string;
  keyDifferences?: string[];
  programmingScore?: number | string;
  mathScore?: number | string;
  engineeringScore?: number | string;
  analyticsScore?: number | string;
  aiScore?: number | string;
  learningDifficulty?: number | string;
  passingScores?: Array<{
    year?: number | string;
    budget?: string;
    paid?: string;
  }>;
  subjects?: Array<{
    title?: string;
    subjectBlock?: string;
    department?: string;
    hours?: number | string;
    referenceUrl?: string;
    sortOrder?: number | string;
  }>;
};

export interface AdminDirectionContentRepository {
  listDirections(): Promise<AdminDirectionRecord[]>;
  createDirection(input: AdminDirectionRecord): Promise<AdminDirectionRecord>;
  updateDirection(input: AdminDirectionRecord): Promise<AdminDirectionRecord>;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new DirectionContentValidationError(`${field} is required.`);
  }

  return value.trim();
}

function requireNonNegativeInteger(value: unknown, field: string): number {
  const candidate: unknown =
    typeof value === "string" && value.trim().length > 0
      ? Number(value)
      : value;

  if (
    typeof candidate !== "number" ||
    !Number.isFinite(candidate) ||
    !Number.isInteger(candidate) ||
    candidate < 0
  ) {
    throw new DirectionContentValidationError(
      `${field} must be a non-negative integer.`,
    );
  }

  return candidate;
}

function requireScore(value: unknown, field: string): number {
  const parsed = requireNonNegativeInteger(value, field);

  if (parsed > 5) {
    throw new DirectionContentValidationError(
      `${field} must be between 0 and 5.`,
    );
  }

  return parsed;
}

function sanitizeStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new DirectionContentValidationError(`${field} must be an array.`);
  }

  return value
    .map((item) => {
      if (typeof item !== "string") {
        throw new DirectionContentValidationError(
          `${field} must contain only strings.`,
        );
      }

      return item.trim();
    })
    .filter((item) => item.length > 0);
}

function isJsonValue(value: unknown): value is Prisma.JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((entry) => isJsonValue(entry));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every((entry) =>
      isJsonValue(entry),
    );
  }

  return false;
}

function sanitizeLearningContent(value: unknown): Prisma.JsonValue | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (!isJsonValue(value)) {
    throw new DirectionContentValidationError(
      "learningContent must be valid JSON-compatible data.",
    );
  }

  return value;
}

function sanitizePassingScores(
  value: AdminDirectionRawInput["passingScores"],
): AdminDirectionPassingScore[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new DirectionContentValidationError(
      "passingScores must contain at least one score row.",
    );
  }

  const rows = value.map((row, index) => ({
    year: requireNonNegativeInteger(row?.year, `passingScores[${index}].year`),
    budget: requireString(row?.budget, `passingScores[${index}].budget`),
    paid: requireString(row?.paid, `passingScores[${index}].paid`),
  }));

  const uniqueYears = new Set(rows.map((row) => row.year));

  if (uniqueYears.size !== rows.length) {
    throw new DirectionContentValidationError(
      "passingScores cannot contain duplicate years.",
    );
  }

  return rows.sort((left, right) => left.year - right.year);
}

function sanitizeSubjects(
  value: AdminDirectionRawInput["subjects"],
): AdminDirectionSubject[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new DirectionContentValidationError(
      "subjects must contain at least one subject row.",
    );
  }

  return value
    .map((row, index) => ({
      title: requireString(row?.title, `subjects[${index}].title`),
      subjectBlock: requireString(
        row?.subjectBlock,
        `subjects[${index}].subjectBlock`,
      ),
      department: requireString(
        row?.department,
        `subjects[${index}].department`,
      ),
      hours: requireNonNegativeInteger(row?.hours, `subjects[${index}].hours`),
      referenceUrl: requireString(
        row?.referenceUrl,
        `subjects[${index}].referenceUrl`,
      ),
      sortOrder: requireNonNegativeInteger(
        row?.sortOrder,
        `subjects[${index}].sortOrder`,
      ),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function generateDirectionId(input: {
  id?: string;
  code: string;
  slug: string;
}): string {
  if (typeof input.id === "string" && input.id.trim().length > 0) {
    return input.id.trim();
  }

  const codeToken = input.code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (codeToken.length > 0) {
    return `direction-${codeToken}`;
  }

  const slugToken = input.slug
    .toLowerCase()
    .replace(/^program-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `direction-${slugToken}`;
}

export function validateDirectionContentInput(
  input: AdminDirectionRawInput,
  overrides?: { id?: string },
): AdminDirectionRecord {
  const code = requireString(input.code, "code");
  const slug = requireString(input.slug, "slug");

  return {
    id: generateDirectionId({
      id: overrides?.id ?? input.id,
      code,
      slug,
    }),
    code,
    slug,
    title: requireString(input.title, "title"),
    shortDescription: requireString(input.shortDescription, "shortDescription"),
    qualification: requireString(input.qualification, "qualification"),
    department: requireString(input.department, "department"),
    studyDuration: requireString(input.studyDuration, "studyDuration"),
    budgetSeats: requireNonNegativeInteger(input.budgetSeats, "budgetSeats"),
    paidSeats: requireNonNegativeInteger(input.paidSeats, "paidSeats"),
    tuitionPerYearRub: requireNonNegativeInteger(
      input.tuitionPerYearRub,
      "tuitionPerYearRub",
    ),
    programFocus: requireString(input.programFocus, "programFocus"),
    whatYouLearn: requireString(input.whatYouLearn, "whatYouLearn"),
    programDescriptionUrl: requireString(
      input.programDescriptionUrl,
      "programDescriptionUrl",
    ),
    curriculumUrl: requireString(input.curriculumUrl, "curriculumUrl"),
    learningContent: sanitizeLearningContent(input.learningContent),
    careerPaths: sanitizeStringArray(input.careerPaths, "careerPaths"),
    targetFit: requireString(input.targetFit, "targetFit"),
    keyDifferences: sanitizeStringArray(input.keyDifferences, "keyDifferences"),
    programmingScore: requireScore(input.programmingScore, "programmingScore"),
    mathScore: requireScore(input.mathScore, "mathScore"),
    engineeringScore: requireScore(input.engineeringScore, "engineeringScore"),
    analyticsScore: requireScore(input.analyticsScore, "analyticsScore"),
    aiScore: requireScore(input.aiScore, "aiScore"),
    learningDifficulty: requireScore(
      input.learningDifficulty,
      "learningDifficulty",
    ),
    passingScores: sanitizePassingScores(input.passingScores),
    subjects: sanitizeSubjects(input.subjects),
  };
}
