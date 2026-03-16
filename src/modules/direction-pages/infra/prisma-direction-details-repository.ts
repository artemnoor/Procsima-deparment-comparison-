import type { PrismaClient } from "@prisma/client";

import type {
  DirectionAxisScores,
  DirectionDetail,
} from "@/shared/kernel/direction";

import type { DirectionDetailsRepository } from "../domain/direction-details-repository";

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

export class PrismaDirectionDetailsRepository implements DirectionDetailsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDirectionBySlug(slug: string): Promise<DirectionDetail | null> {
    const direction = await this.prisma.direction.findUnique({
      where: { slug },
    });

    if (!direction) {
      return null;
    }

    return {
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
      whatYouLearn: direction.whatYouLearn,
      careerPaths: direction.careerPaths,
      targetFit: direction.targetFit,
      keyDifferences: direction.keyDifferences,
      axisScores: mapAxisScores(direction),
      passingScores: [],
      subjects: [],
      programDescriptionUrl: null,
      curriculumUrl: null,
    };
  }
}
