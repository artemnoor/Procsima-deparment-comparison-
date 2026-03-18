import type { PrismaClient } from "@prisma/client";

import { mapPrismaDirectionToDetail } from "@/app/prisma-public-direction-read-model";
import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import type { DirectionDetailsRepository } from "../domain/direction-details-repository";

export class PrismaDirectionDetailsRepository implements DirectionDetailsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDirectionBySlug(slug: string): Promise<DirectionDetail | null> {
    logWithLevel(
      "prisma-direction-details-repository",
      "info",
      "Looking up direction detail in Prisma source.",
      {
        source: "prisma",
        slug,
      },
    );

    const direction = await this.prisma.direction.findUnique({
      where: { slug },
      include: {
        passingScores: true,
        subjects: true,
      },
    });

    if (!direction) {
      logWithLevel(
        "prisma-direction-details-repository",
        "warn",
        "Direction detail was not found in Prisma source.",
        {
          slug,
        },
      );

      return null;
    }

    const directionDetail = mapPrismaDirectionToDetail(direction);

    logWithLevel(
      "prisma-direction-details-repository",
      "debug",
      "Mapped Prisma direction detail from persisted applicant data.",
      {
        slug,
        directionId: directionDetail.id,
        subjectCount: directionDetail.subjects.length,
        passingScoreCount: directionDetail.passingScores.length,
        deferredFields: directionDetail.learningContent.deferredFields.map(
          (field) => field.field,
        ),
      },
    );

    return directionDetail;
  }
}
