import type { DirectionDetail } from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";

import { compareDirections } from "./compare-directions";
import {
  maximumComparisonDirectionCount,
  minimumComparisonDirectionCount,
  readComparisonSelection,
  type ComparisonSelection,
} from "./comparison-selection";
import type { DirectionComparisonRepository } from "../domain/direction-comparison-repository";
import type { ComparisonResult } from "../domain/comparison";

export type ComparisonPageState =
  | "empty"
  | "under-minimum"
  | "over-limit"
  | "missing-directions"
  | "ready";

export type ComparisonPageData = {
  selection: ComparisonSelection;
  directions: DirectionDetail[];
  comparison: ComparisonResult | null;
  state: ComparisonPageState;
};

export async function getComparisonPageData(
  repository: DirectionComparisonRepository,
  input: {
    ids?: string | string[] | undefined;
    source?: string | undefined;
  },
): Promise<ComparisonPageData> {
  const selection = readComparisonSelection(input);

  if (selection.state === "empty") {
    logWithLevel(
      "comparison-page-data",
      "info",
      "Comparison page entered with empty selection.",
      {
        directionIds: selection.directionIds,
      },
    );

    return {
      selection,
      directions: [],
      comparison: null,
      state: "empty",
    };
  }

  if (selection.directionIds.length < minimumComparisonDirectionCount) {
    logWithLevel(
      "comparison-page-data",
      "warn",
      "Comparison page entered below the minimum selection threshold.",
      {
        directionIds: selection.directionIds,
        minimumComparisonDirectionCount,
      },
    );

    return {
      selection,
      directions: [],
      comparison: null,
      state: "under-minimum",
    };
  }

  if (selection.directionIds.length > maximumComparisonDirectionCount) {
    logWithLevel(
      "comparison-page-data",
      "warn",
      "Comparison page entered above the maximum selection threshold.",
      {
        directionIds: selection.directionIds,
        maximumComparisonDirectionCount,
      },
    );

    return {
      selection,
      directions: [],
      comparison: null,
      state: "over-limit",
    };
  }

  const directions = await repository.findDirectionsByIds(selection.directionIds);

  logWithLevel(
    "comparison-page-data",
    "info",
    "Resolved directions for comparison page.",
    {
      requestedDirectionIds: selection.directionIds,
      resolvedDirectionIds: directions.map((direction) => direction.id),
    },
  );

  if (directions.length !== selection.directionIds.length) {
    logWithLevel(
      "comparison-page-data",
      "warn",
      "Comparison page is missing one or more requested directions.",
      {
        requestedCount: selection.directionIds.length,
        resolvedCount: directions.length,
      },
    );

    return {
      selection,
      directions,
      comparison: null,
      state: "missing-directions",
    };
  }

  const comparison = compareDirections({
    directions,
  });

  logWithLevel(
    "comparison-page-data",
    "debug",
    "Built comparison result for selected directions.",
    {
      directionIds: comparison.directionIds,
      comparedFields: comparison.comparedFields,
    },
  );

  return {
    selection,
    directions,
    comparison,
    state: "ready",
  };
}
