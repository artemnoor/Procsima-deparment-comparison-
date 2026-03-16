import type { PrismaClient } from "@prisma/client";

import { logWithLevel } from "@/shared/utils/logging";

import type { RecommendationCandidateRepository } from "../domain/recommendation-candidate-repository";
import type { RecommendationCandidate } from "../domain/recommendation-candidate";

function mapCandidate(
  input: Awaited<ReturnType<PrismaClient["direction"]["findMany"]>>[number],
): RecommendationCandidate {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    programFocus: input.programFocus,
    learningDifficulty: input.learningDifficulty,
    axisScores: {
      programming: input.programmingScore ?? 0,
      math: input.mathScore ?? 0,
      engineering: input.engineeringScore ?? 0,
      analytics: input.analyticsScore ?? 0,
      ai: input.aiScore ?? 0,
    },
    subjectBlocks: [],
    targetFit: input.targetFit,
    keyDifferences: input.keyDifferences,
    whatYouLearn: input.whatYouLearn,
  };
}

export class PrismaRecommendationCandidateRepository implements RecommendationCandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listCandidates(): Promise<RecommendationCandidate[]> {
    logWithLevel(
      "prisma-recommendation-candidate-repository",
      "info",
      "Resolving recommendation candidates from Prisma source.",
      {
        source: "prisma",
        provider: "direction-table",
      },
    );

    const candidates = (await this.prisma.direction.findMany()).map(
      mapCandidate,
    );

    logWithLevel(
      "prisma-recommendation-candidate-repository",
      "debug",
      "Resolved recommendation candidates from Prisma source.",
      {
        source: "prisma",
        candidateCount: candidates.length,
      },
    );

    return candidates;
  }
}
