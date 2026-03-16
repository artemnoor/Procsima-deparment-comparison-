import type { DirectionDetail } from "@/shared/kernel/direction";
import { findMissingMvpLearningContentFields } from "@/modules/learning-content";
import { logWithLevel } from "@/shared/utils/logging";

import type { DirectionDetailsRepository } from "../domain/direction-details-repository";

export async function getDirectionDetails(
  repository: DirectionDetailsRepository,
  slug: string,
): Promise<DirectionDetail | null> {
  const direction = await repository.findDirectionBySlug(slug);

  if (!direction) {
    return null;
  }

  const missingLearningContentFields = findMissingMvpLearningContentFields(
    direction.learningContent,
  );

  if (missingLearningContentFields.length > 0) {
    logWithLevel(
      "direction-details",
      "warn",
      "Direction detail contains fallback or incomplete MVP learning-content fields.",
      {
        slug,
        directionId: direction.id,
        missingLearningContentFields,
      },
    );
  } else {
    logWithLevel(
      "direction-details",
      "debug",
      "Direction detail resolved with complete MVP learning-content fields.",
      {
        slug,
        directionId: direction.id,
        learningOutcomes: direction.learningContent.outcomes.length,
        studyFocuses: direction.learningContent.studyFocuses.length,
      },
    );
  }

  return direction;
}
