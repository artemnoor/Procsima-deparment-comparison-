import type { PrismaClient } from "@prisma/client";

import { mapPrismaDirectionToDetail } from "@/app/prisma-public-direction-read-model";
import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import type { DirectionComparisonRepository } from "../domain/direction-comparison-repository";

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
      include: {
        passingScores: true,
        subjects: true,
      },
    });

    const directionsById = new Map(
      directions
        .map(mapPrismaDirectionToDetail)
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
        subjectCounts: mappedDirections.map((direction) => ({
          directionId: direction.id,
          subjectCount: direction.subjects.length,
        })),
      },
    );

    return mappedDirections;
  }
}
