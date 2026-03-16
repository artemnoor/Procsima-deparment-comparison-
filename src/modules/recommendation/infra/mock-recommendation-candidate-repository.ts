import { loadMockDirectionSourceRecords } from "@/modules/content";
import { logWithLevel } from "@/shared/utils/logging";

import type { RecommendationCandidateRepository } from "../domain/recommendation-candidate-repository";
import type { RecommendationCandidate } from "../domain/recommendation-candidate";

function mapCandidate(input: ReturnType<typeof loadMockDirectionSourceRecords>[number]): RecommendationCandidate {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    shortDescription: input.shortDescription,
    programFocus: input.profile.programFocus,
    learningDifficulty: input.profile.learningDifficulty,
    axisScores: input.profile.axisScores,
    subjectBlocks: input.subjectBlocks,
    targetFit: input.profile.targetFit,
    keyDifferences: input.profile.keyDifferences,
    whatYouLearn: input.profile.whatYouLearn,
  };
}

export class MockRecommendationCandidateRepository
  implements RecommendationCandidateRepository
{
  async listCandidates(): Promise<RecommendationCandidate[]> {
    logWithLevel(
      "mock-recommendation-candidate-repository",
      "info",
      "Resolving recommendation candidates from mock source.",
      {
        source: "mock",
        provider: "mock-direction-source",
      },
    );

    const candidates = loadMockDirectionSourceRecords().map(mapCandidate);

    logWithLevel(
      "mock-recommendation-candidate-repository",
      "debug",
      "Resolved recommendation candidates from mock source.",
      {
        source: "mock",
        candidateCount: candidates.length,
      },
    );

    return candidates;
  }
}
