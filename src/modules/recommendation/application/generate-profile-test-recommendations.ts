import type { RecommendationCandidate } from "../domain/recommendation-candidate";
import type {
  ParsedProfileTestSubmission,
  RecommendationConfidence,
  RecommendationMatch,
  RecommendationResult,
} from "../domain/profile-test";
import { directionAxes } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import { buildRecommendationProfile } from "./build-recommendation-profile";

function humanizeProgramFocus(programFocus: string): string {
  return programFocus.replaceAll("-", " ");
}

function resolveConfidence(
  score: number,
  topScore: number,
): RecommendationConfidence {
  if (score >= 18 && score >= topScore - 2) {
    return "high";
  }

  if (score >= 11) {
    return "medium";
  }

  return "emerging";
}

function buildExplanation(
  candidate: RecommendationCandidate,
  profile: RecommendationResult["profile"],
): string[] {
  const explanation: string[] = [];
  const sharedSubjectBlocks = candidate.subjectBlocks.filter((subjectBlock) =>
    profile.preferredSubjectBlocks.includes(subjectBlock),
  );

  if (
    candidate.programFocus &&
    profile.preferredProgramFocuses.includes(candidate.programFocus)
  ) {
    explanation.push(
      `This direction aligns with your interest in ${humanizeProgramFocus(candidate.programFocus)} work.`,
    );
  }

  const matchingAxes = [...directionAxes]
    .filter(
      (axis) =>
        profile.axisWeights[axis] > 0 && (candidate.axisScores[axis] ?? 0) >= 3,
    )
    .sort(
      (leftAxis, rightAxis) =>
        candidate.axisScores[rightAxis] - candidate.axisScores[leftAxis],
    )
    .slice(0, 2);

  if (matchingAxes.length > 0) {
    explanation.push(
      `It scores strongly in ${matchingAxes.join(" and ")}, which matches your strongest answer pattern.`,
    );
  }

  if (sharedSubjectBlocks.length > 0) {
    explanation.push(
      `Its subject mix includes ${sharedSubjectBlocks.slice(0, 2).join(" and ")}.`,
    );
  } else if (candidate.targetFit) {
    explanation.push(candidate.targetFit);
  } else if (candidate.keyDifferences[0]) {
    explanation.push(candidate.keyDifferences[0]);
  }

  return explanation.slice(0, 3);
}

export function generateProfileTestRecommendations(
  submission: ParsedProfileTestSubmission,
  candidates: RecommendationCandidate[],
): RecommendationResult {
  const profile = buildRecommendationProfile(submission);

  if (submission.state !== "complete") {
    return {
      profile,
      recommendedDirectionIds: [],
      matches: [],
      summary:
        "Complete the full profile test to see explainable recommendations.",
    };
  }

  const scoredMatches = candidates
    .map((candidate) => {
      const axisScore = directionAxes.reduce(
        (total, axis) =>
          total + profile.axisWeights[axis] * (candidate.axisScores[axis] ?? 0),
        0,
      );
      const programFocusBonus =
        candidate.programFocus &&
        profile.preferredProgramFocuses.includes(candidate.programFocus)
          ? 6
          : 0;
      const subjectBlockBonus =
        candidate.subjectBlocks.filter((subjectBlock) =>
          profile.preferredSubjectBlocks.includes(subjectBlock),
        ).length * 2;
      const score = axisScore + programFocusBonus + subjectBlockBonus;

      return {
        candidate,
        score,
      };
    })
    .sort((leftMatch, rightMatch) => {
      const scoreDelta = rightMatch.score - leftMatch.score;

      return scoreDelta !== 0
        ? scoreDelta
        : leftMatch.candidate.title.localeCompare(rightMatch.candidate.title);
    })
    .slice(0, 3);
  const topScore = scoredMatches[0]?.score ?? 0;
  const matches: RecommendationMatch[] = scoredMatches.map(
    ({ candidate, score }) => ({
      directionId: candidate.id,
      slug: candidate.slug,
      title: candidate.title,
      score,
      confidence: resolveConfidence(score, topScore),
      explanation: buildExplanation(candidate, profile),
    }),
  );
  const recommendedDirectionIds = matches.map((match) => match.directionId);
  const summary = profile.preferredProgramFocuses.includes("software-development")
    ? "Your answers point most strongly toward software-oriented directions with structured problem solving."
    : profile.preferredProgramFocuses.includes("information-security")
      ? "Your answers point toward security-focused directions with protection and risk analysis."
      : "Your answers point toward infrastructure-oriented directions with systems and operational ownership.";

  logWithLevel(
    "recommendation-scoring",
    "info",
    "Generated recommendation ranking from profile test answers.",
    {
      submissionState: submission.state,
      candidateCount: candidates.length,
      dominantAxes: profile.dominantAxes,
      preferredProgramFocuses: profile.preferredProgramFocuses,
      explanationAnchors: profile.explanationAnchors,
      topMatches: matches.map((match) => ({
        directionId: match.directionId,
        score: match.score,
        confidence: match.confidence,
      })),
    },
  );

  return {
    profile,
    recommendedDirectionIds,
    matches,
    summary,
  };
}
