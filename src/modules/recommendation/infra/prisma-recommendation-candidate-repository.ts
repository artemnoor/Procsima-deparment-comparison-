import type { PrismaClient } from "@prisma/client";

import { mapPrismaDirectionToRecommendationCandidate } from "@/app/prisma-public-direction-read-model";
import { logWithLevel } from "@/shared/utils/logging";

import type { RecommendationCandidateRepository } from "../domain/recommendation-candidate-repository";
import type { RecommendationCandidate } from "../domain/recommendation-candidate";

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

    const candidates = (
      await this.prisma.direction.findMany({
        include: {
          passingScores: true,
          subjects: true,
        },
      })
    ).map(mapPrismaDirectionToRecommendationCandidate);

    logWithLevel(
      "prisma-recommendation-candidate-repository",
      "debug",
      "Resolved recommendation candidates from Prisma source.",
      {
        source: "prisma",
        candidateCount: candidates.length,
        subjectBlockCoverage: candidates.map((candidate) => ({
          directionId: candidate.id,
          subjectBlocks: candidate.subjectBlocks,
        })),
      },
    );

    return candidates;
  }
}
