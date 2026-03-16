import {
  createEmptyRecommendationAxisWeights,
  profileTestQuestions,
  type ParsedProfileTestSubmission,
  type RecommendationProfile,
} from "../domain/profile-test";
import { directionAxes } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)];
}

export function buildRecommendationProfile(
  submission: ParsedProfileTestSubmission,
): RecommendationProfile {
  const axisWeights = createEmptyRecommendationAxisWeights();
  const preferredProgramFocuses: string[] = [];
  const preferredSubjectBlocks: string[] = [];
  const explanationAnchors: string[] = [];
  const questionById = new Map(
    profileTestQuestions.map((question) => [question.id, question] as const),
  );

  for (const answer of submission.answers) {
    const question = questionById.get(answer.questionId);

    if (!question) {
      continue;
    }

    for (const selectedOptionId of answer.selectedOptionIds) {
      const option = question.options.find(
        (questionOption) => questionOption.id === selectedOptionId,
      );

      if (!option) {
        continue;
      }

      for (const axis of directionAxes) {
        axisWeights[axis] += option.axisBoosts[axis] ?? 0;
      }

      preferredProgramFocuses.push(...option.preferredProgramFocuses);
      preferredSubjectBlocks.push(...option.preferredSubjectBlocks);
      explanationAnchors.push(option.explanationAnchor);
    }
  }

  const dominantAxes = [...directionAxes]
    .sort((leftAxis, rightAxis) => {
      const delta = axisWeights[rightAxis] - axisWeights[leftAxis];

      return delta !== 0 ? delta : leftAxis.localeCompare(rightAxis);
    })
    .filter((axis) => axisWeights[axis] > 0)
    .slice(0, 3);

  const profile: RecommendationProfile = {
    axisWeights,
    preferredProgramFocuses: uniqueValues(preferredProgramFocuses),
    preferredSubjectBlocks: uniqueValues(preferredSubjectBlocks),
    explanationAnchors: uniqueValues(explanationAnchors),
    dominantAxes,
  };

  logWithLevel(
    "recommendation-profile",
    "info",
    "Built recommendation profile from parsed answers.",
    {
      submissionState: submission.state,
      dominantAxes,
      preferredProgramFocuses: profile.preferredProgramFocuses,
      preferredSubjectBlocks: profile.preferredSubjectBlocks,
      explanationAnchors: profile.explanationAnchors,
    },
  );

  return profile;
}
