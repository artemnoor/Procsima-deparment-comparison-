import type { PrismaClient } from "@prisma/client";

import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import type { DirectionComparisonRepository } from "../domain/direction-comparison-repository";

function mapDirectionDetail(input: {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  programFocus: string | null;
  learningDifficulty: number | null;
  whatYouLearn: string | null;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  programmingScore: number | null;
  mathScore: number | null;
  engineeringScore: number | null;
  analyticsScore: number | null;
  aiScore: number | null;
}): DirectionDetail {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    programFocus: input.programFocus,
    learningDifficulty: input.learningDifficulty,
    context: {
      code: null,
      qualification: null,
      department: null,
      studyDuration: null,
      budgetSeats: null,
      paidSeats: null,
      tuitionPerYearRub: null,
    },
    whatYouLearn: input.whatYouLearn,
    careerPaths: input.careerPaths,
    targetFit: input.targetFit,
    keyDifferences: input.keyDifferences,
    axisScores: {
      programming: input.programmingScore ?? 0,
      math: input.mathScore ?? 0,
      engineering: input.engineeringScore ?? 0,
      analytics: input.analyticsScore ?? 0,
      ai: input.aiScore ?? 0,
    },
    passingScores: [],
    subjects: [],
    programDescriptionUrl: null,
    curriculumUrl: null,
  };
}

export class PrismaDirectionComparisonRepository implements DirectionComparisonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDirectionsByIds(
    directionIds: string[],
  ): Promise<DirectionDetail[]> {
    logWithLevel(
      "prisma-direction-comparison-repository",
      "info",
      "Resolving comparison directions from Prisma source.",
      {
        source: "prisma",
        directionIds,
      },
    );

    const directions = await this.prisma.direction.findMany({
      where: {
        id: {
          in: directionIds,
        },
      },
    });

    const directionsById = new Map(
      directions
        .map(mapDirectionDetail)
        .map((direction) => [direction.id, direction] as const),
    );
    const mappedDirections = directionIds.flatMap((directionId) => {
      const direction = directionsById.get(directionId);

      return direction ? [direction] : [];
    });

    logWithLevel(
      "prisma-direction-comparison-repository",
      "debug",
      "Resolved comparison directions from Prisma source.",
      {
        requestedCount: directionIds.length,
        resolvedCount: mappedDirections.length,
      },
    );

    return mappedDirections;
  }
}
