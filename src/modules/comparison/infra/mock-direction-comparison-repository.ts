import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";
import {
  loadMockDirectionSourceRecords,
  mapDirectionSourceToDetail,
} from "@/modules/content";

import type { DirectionComparisonRepository } from "../domain/direction-comparison-repository";

export class MockDirectionComparisonRepository implements DirectionComparisonRepository {
  async findDirectionsByIds(
    directionIds: string[],
  ): Promise<DirectionDetail[]> {
    logWithLevel(
      "mock-direction-comparison-repository",
      "info",
      "Resolving comparison directions from mock source.",
      {
        source: "mock",
        directionIds,
      },
    );

    const directionsById = new Map(
      loadMockDirectionSourceRecords()
        .map(mapDirectionSourceToDetail)
        .map((direction) => [direction.id, direction] as const),
    );
    const selectedDirections = directionIds.flatMap((directionId) => {
      const direction = directionsById.get(directionId);

      return direction ? [direction] : [];
    });

    logWithLevel(
      "mock-direction-comparison-repository",
      "debug",
      "Resolved comparison directions from mock source.",
      {
        requestedCount: directionIds.length,
        resolvedCount: selectedDirections.length,
      },
    );

    return selectedDirections;
  }
}
