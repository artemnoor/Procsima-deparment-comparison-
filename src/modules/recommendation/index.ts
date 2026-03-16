export {
  createEmptyRecommendationAxisWeights,
  profileTestQuestions,
  profileTestQuestionKinds,
} from "./domain/profile-test";
export type {
  MultiSelectProfileTestQuestion,
  ParsedProfileTestAnswer,
  ParsedProfileTestSubmission,
  ParsedProfileTestSubmissionState,
  ProfileTestQuestion,
  ProfileTestQuestionKind,
  ProfileTestQuestionOption,
  ProfileTestValidationIssue,
  RawProfileTestSubmission,
  RecommendationConfidence,
  RecommendationMatch,
  RecommendationProfile,
  RecommendationResult,
  SingleChoiceProfileTestQuestion,
} from "./domain/profile-test";
export type { RecommendationCandidate } from "./domain/recommendation-candidate";
export type { RecommendationCandidateRepository } from "./domain/recommendation-candidate-repository";
export { buildRecommendationProfile } from "./application/build-recommendation-profile";
export { generateProfileTestRecommendations } from "./application/generate-profile-test-recommendations";
export { parseProfileTestSubmission } from "./application/parse-profile-test-submission";
export { MockRecommendationCandidateRepository } from "./infra/mock-recommendation-candidate-repository";
export { PrismaRecommendationCandidateRepository } from "./infra/prisma-recommendation-candidate-repository";
