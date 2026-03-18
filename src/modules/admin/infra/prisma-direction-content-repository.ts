import { Prisma, type PrismaClient } from "@prisma/client";

import { logWithLevel } from "@/shared/utils/logging";

import {
  type AdminDirectionContentRepository,
  type AdminDirectionRecord,
  DirectionContentNotFoundError,
  DirectionContentValidationError,
} from "../domain/direction-content";

type DirectionWithRelations = {
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
  passingScores: Array<{
    year: number;
    budget: Prisma.Decimal;
    paid: Prisma.Decimal;
  }>;
  subjects: Array<{
    title: string;
    subjectBlock: string;
    department: string;
    hours: number;
    referenceUrl: string;
    sortOrder: number;
  }>;
};

function mapDirectionRecord(
  direction: DirectionWithRelations,
): AdminDirectionRecord {
  return {
    id: direction.id,
    code: direction.code,
    slug: direction.slug,
    title: direction.title,
    shortDescription: direction.shortDescription,
    qualification: direction.qualification,
    department: direction.department,
    studyDuration: direction.studyDuration,
    budgetSeats: direction.budgetSeats,
    paidSeats: direction.paidSeats,
    tuitionPerYearRub: direction.tuitionPerYearRub,
    programFocus: direction.programFocus,
    whatYouLearn: direction.whatYouLearn,
    programDescriptionUrl: direction.programDescriptionUrl,
    curriculumUrl: direction.curriculumUrl,
    learningContent: direction.learningContent,
    careerPaths: direction.careerPaths,
    targetFit: direction.targetFit,
    keyDifferences: direction.keyDifferences,
    programmingScore: direction.programmingScore,
    mathScore: direction.mathScore,
    engineeringScore: direction.engineeringScore,
    analyticsScore: direction.analyticsScore,
    aiScore: direction.aiScore,
    learningDifficulty: direction.learningDifficulty,
    passingScores: direction.passingScores.map((score) => ({
      year: score.year,
      budget: score.budget.toString(),
      paid: score.paid.toString(),
    })),
    subjects: direction.subjects.map((subject) => ({
      title: subject.title,
      subjectBlock: subject.subjectBlock,
      department: subject.department,
      hours: subject.hours,
      referenceUrl: subject.referenceUrl,
      sortOrder: subject.sortOrder,
    })),
  };
}

function createDirectionBaseData(input: AdminDirectionRecord) {
  return {
    code: input.code,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    qualification: input.qualification,
    department: input.department,
    studyDuration: input.studyDuration,
    budgetSeats: input.budgetSeats,
    paidSeats: input.paidSeats,
    tuitionPerYearRub: input.tuitionPerYearRub,
    programFocus: input.programFocus,
    whatYouLearn: input.whatYouLearn,
    programDescriptionUrl: input.programDescriptionUrl,
    curriculumUrl: input.curriculumUrl,
    learningContent: input.learningContent ?? Prisma.JsonNull,
    careerPaths: input.careerPaths,
    targetFit: input.targetFit,
    keyDifferences: input.keyDifferences,
    programmingScore: input.programmingScore,
    mathScore: input.mathScore,
    engineeringScore: input.engineeringScore,
    analyticsScore: input.analyticsScore,
    aiScore: input.aiScore,
    learningDifficulty: input.learningDifficulty,
  };
}

export class PrismaDirectionContentRepository implements AdminDirectionContentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listDirections(): Promise<AdminDirectionRecord[]> {
    logWithLevel(
      "prisma-direction-content-repository",
      "debug",
      "Loading editable directions from Prisma.",
      { source: "prisma" },
    );

    const directions = await this.prisma.direction.findMany({
      orderBy: [{ title: "asc" }],
      include: {
        passingScores: {
          orderBy: { year: "asc" },
        },
        subjects: {
          orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        },
      },
    });

    return directions.map((direction) =>
      mapDirectionRecord(direction as DirectionWithRelations),
    );
  }

  async createDirection(
    input: AdminDirectionRecord,
  ): Promise<AdminDirectionRecord> {
    logWithLevel(
      "prisma-direction-content-repository",
      "info",
      "Creating editable direction in Prisma.",
      { directionId: input.id, slug: input.slug },
    );

    try {
      return await this.prisma.$transaction(async (transaction) => {
        await transaction.direction.create({
          data: {
            id: input.id,
            ...createDirectionBaseData(input),
            passingScores: {
              createMany: {
                data: input.passingScores.map((score) => ({
                  year: score.year,
                  budget: score.budget,
                  paid: score.paid,
                })),
              },
            },
            subjects: {
              createMany: {
                data: input.subjects.map((subject) => ({
                  title: subject.title,
                  subjectBlock: subject.subjectBlock,
                  department: subject.department,
                  hours: subject.hours,
                  referenceUrl: subject.referenceUrl,
                  sortOrder: subject.sortOrder,
                })),
              },
            },
          },
        });

        const persisted = await transaction.direction.findUniqueOrThrow({
          where: { id: input.id },
          include: {
            passingScores: {
              orderBy: { year: "asc" },
            },
            subjects: {
              orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
            },
          },
        });

        return mapDirectionRecord(persisted as DirectionWithRelations);
      });
    } catch (error) {
      this.rethrowKnownErrors(error, input.id);
      throw error;
    }
  }

  async updateDirection(
    input: AdminDirectionRecord,
  ): Promise<AdminDirectionRecord> {
    logWithLevel(
      "prisma-direction-content-repository",
      "info",
      "Updating editable direction in Prisma.",
      { directionId: input.id, slug: input.slug },
    );

    try {
      return await this.prisma.$transaction(async (transaction) => {
        await transaction.direction.update({
          where: { id: input.id },
          data: createDirectionBaseData(input),
        });

        await transaction.directionPassingScore.deleteMany({
          where: { directionId: input.id },
        });
        await transaction.directionSubject.deleteMany({
          where: { directionId: input.id },
        });

        await transaction.directionPassingScore.createMany({
          data: input.passingScores.map((score) => ({
            directionId: input.id,
            year: score.year,
            budget: score.budget,
            paid: score.paid,
          })),
        });

        await transaction.directionSubject.createMany({
          data: input.subjects.map((subject) => ({
            directionId: input.id,
            title: subject.title,
            subjectBlock: subject.subjectBlock,
            department: subject.department,
            hours: subject.hours,
            referenceUrl: subject.referenceUrl,
            sortOrder: subject.sortOrder,
          })),
        });

        const persisted = await transaction.direction.findUniqueOrThrow({
          where: { id: input.id },
          include: {
            passingScores: {
              orderBy: { year: "asc" },
            },
            subjects: {
              orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
            },
          },
        });

        return mapDirectionRecord(persisted as DirectionWithRelations);
      });
    } catch (error) {
      this.rethrowKnownErrors(error, input.id);
      throw error;
    }
  }

  private rethrowKnownErrors(error: unknown, directionId: string): void {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      throw new DirectionContentNotFoundError(directionId);
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new DirectionContentValidationError(
        "Direction with the same unique identifier already exists.",
      );
    }
  }
}
