import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";
import { loadMockDirectionSourceRecords } from "@/modules/content";
import { mapDirectionSourceToDetail } from "@/modules/learning-content";

import type { DirectionDetailsRepository } from "../domain/direction-details-repository";

export class MockDirectionDetailsRepository implements DirectionDetailsRepository {
  async findDirectionBySlug(slug: string): Promise<DirectionDetail | null> {
    logWithLevel(
      "mock-direction-details-repository",
      "info",
      "Looking up direction detail in mock source.",
      {
        source: "mock",
        slug,
      },
    );

    const sourceRecord = loadMockDirectionSourceRecords().find(
      (direction) => direction.slug === slug,
    );

    if (!sourceRecord) {
      logWithLevel(
        "mock-direction-details-repository",
        "warn",
        "Direction detail was not found in mock source.",
        {
          slug,
        },
      );

      return null;
    }

    const directionDetail = mapDirectionSourceToDetail(sourceRecord);

    logWithLevel(
      "mock-direction-details-repository",
      "debug",
      "Mapped mock direction detail record.",
      {
        slug,
        directionId: directionDetail.id,
        subjectCount: directionDetail.subjects.length,
      },
    );

    return directionDetail;
  }
}
