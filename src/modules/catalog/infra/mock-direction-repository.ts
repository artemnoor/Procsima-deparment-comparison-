import type { DirectionSummary } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";
import { loadMockDirectionSourceRecords } from "@/modules/content";
import { mapDirectionSourceToSummary } from "@/modules/learning-content";

import type { DirectionCatalogRepository } from "../domain/direction-repository";

export class MockDirectionCatalogRepository implements DirectionCatalogRepository {
  async listDirections(): Promise<DirectionSummary[]> {
    logWithLevel(
      "mock-direction-catalog-repository",
      "info",
      "Loading catalog directions from mock source.",
      {
        source: "mock",
      },
    );

    const directions = loadMockDirectionSourceRecords()
      .map(mapDirectionSourceToSummary)
      .sort((leftDirection, rightDirection) =>
        leftDirection.title.localeCompare(rightDirection.title),
      );

    logWithLevel(
      "mock-direction-catalog-repository",
      "debug",
      "Mapped mock direction catalog records.",
      {
        count: directions.length,
        directionIds: directions.map((direction) => direction.id),
      },
    );

    return directions;
  }
}
