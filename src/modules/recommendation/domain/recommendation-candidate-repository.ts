import type { RecommendationCandidate } from "./recommendation-candidate";

export interface RecommendationCandidateRepository {
  listCandidates(): Promise<RecommendationCandidate[]>;
}
