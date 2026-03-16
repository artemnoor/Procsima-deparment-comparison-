import type {
  ParsedProfileTestSubmission,
  ProfileTestQuestion,
  RawProfileTestSubmission,
} from "../domain/profile-test";
import { logWithLevel } from "@/shared/utils/logging";

function normalizeSubmissionValue(
  value: string | string[] | undefined,
): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => entry.trim()).filter(Boolean);
  }

  return value ? [value.trim()].filter(Boolean) : [];
}

export function parseProfileTestSubmission(
  questions: ProfileTestQuestion[],
  submission: RawProfileTestSubmission,
): ParsedProfileTestSubmission {
  const questionKinds = [...new Set(questions.map((question) => question.kind))];
  const hasAnySubmittedValue = questions.some(
    (question) => normalizeSubmissionValue(submission[question.id]).length > 0,
  );
  const answers: ParsedProfileTestSubmission["answers"] = [];
  const issues: ParsedProfileTestSubmission["issues"] = [];

  logWithLevel(
    "recommendation-profile-test",
    "info",
    "Parsing profile test submission.",
    {
      questionCount: questions.length,
      activeQuestionTypes: questionKinds,
      hasAnySubmittedValue,
    },
  );

  for (const question of questions) {
    const selectedOptionIds = normalizeSubmissionValue(submission[question.id]);
    const allowedOptionIds = new Set(
      question.options.map((option) => option.id),
    );

    if (selectedOptionIds.length === 0) {
      if (hasAnySubmittedValue && question.required) {
        issues.push({
          questionId: question.id,
          reason: "required",
        });
      }

      continue;
    }

    if (question.kind === "single-choice" && selectedOptionIds.length > 1) {
      issues.push({
        questionId: question.id,
        reason: "invalid-type",
      });

      continue;
    }

    if (selectedOptionIds.some((optionId) => !allowedOptionIds.has(optionId))) {
      issues.push({
        questionId: question.id,
        reason: "unknown-option",
      });

      continue;
    }

    if (question.kind === "multi-select") {
      if (selectedOptionIds.length < question.minSelections) {
        issues.push({
          questionId: question.id,
          reason: "too-few-selections",
        });

        continue;
      }

      if (selectedOptionIds.length > question.maxSelections) {
        issues.push({
          questionId: question.id,
          reason: "too-many-selections",
        });

        continue;
      }
    }

    answers.push({
      questionId: question.id,
      selectedOptionIds,
    });
  }

  const state = !hasAnySubmittedValue
    ? "empty"
    : issues.some(
          (issue) =>
            issue.reason === "invalid-type" ||
            issue.reason === "unknown-option" ||
            issue.reason === "too-many-selections",
        )
      ? "invalid"
      : issues.length > 0
        ? "incomplete"
        : "complete";

  if (issues.length > 0) {
    logWithLevel(
      "recommendation-profile-test",
      state === "invalid" ? "warn" : "info",
      "Profile test submission produced validation issues.",
      {
        issues,
      },
    );
  }

  return {
    answers,
    issues,
    state,
  };
}
