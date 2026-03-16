import type { PrismaClient } from "@prisma/client";

import type { DirectionSummary } from "@/shared/kernel/direction";

import type { DirectionCatalogRepository } from "../domain/direction-repository";

export class PrismaDirectionCatalogRepository implements DirectionCatalogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listDirections(): Promise<DirectionSummary[]> {
    const directions = await this.prisma.direction.findMany({
      orderBy: { title: "asc" },
    });

    return directions.map((direction) => ({
      id: direction.id,
      slug: direction.slug,
      title: direction.title,
      shortDescription: direction.shortDescription,
      programFocus: direction.programFocus,
      learningDifficulty: direction.learningDifficulty,
      context: {
        code: null,
        qualification: null,
        department: null,
        studyDuration: null,
        budgetSeats: null,
        paidSeats: null,
        tuitionPerYearRub: null,
      },
    }));
  }
}
