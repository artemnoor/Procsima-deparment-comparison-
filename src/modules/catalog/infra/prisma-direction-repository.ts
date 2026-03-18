import type { PrismaClient } from "@prisma/client";

import { mapPrismaDirectionToSummary } from "@/app/prisma-public-direction-read-model";
import type { DirectionSummary } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import type { DirectionCatalogRepository } from "../domain/direction-repository";

export class PrismaDirectionCatalogRepository implements DirectionCatalogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listDirections(): Promise<DirectionSummary[]> {
    logWithLevel(
      "prisma-direction-catalog-repository",
      "info",
      "Loading catalog directions from Prisma source.",
      {
        source: "prisma",
      },
    );

    const directions = await this.prisma.direction.findMany({
      orderBy: { title: "asc" },
    });

    const mappedDirections = directions.map(mapPrismaDirectionToSummary);

    logWithLevel(
      "prisma-direction-catalog-repository",
      "debug",
      "Mapped Prisma direction catalog records.",
      {
        count: mappedDirections.length,
        directionIds: mappedDirections.map((direction) => direction.id),
        missingCodes: mappedDirections
          .filter((direction) => !direction.context.code)
          .map((direction) => direction.id),
      },
    );

    return mappedDirections;
  }
}
