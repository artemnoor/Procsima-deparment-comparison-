import { logWithLevel } from "@/shared/utils/logging";

export const minimumComparisonDirectionCount = 2;
export const maximumComparisonDirectionCount = 4;

export type ComparisonEntrySource =
  | "catalog"
  | "direction-detail"
  | "comparison-page";

export type ComparisonSelectionState =
  | "empty"
  | "under-minimum"
  | "ready"
  | "over-limit";

export type ComparisonSelection = {
  directionIds: string[];
  source: ComparisonEntrySource | null;
  state: ComparisonSelectionState;
};

function normalizeDirectionIds(rawValues: string[]): string[] {
  return [...new Set(rawValues.map((value) => value.trim()).filter(Boolean))];
}

function resolveSelectionState(
  directionIds: string[],
): ComparisonSelectionState {
  if (directionIds.length === 0) {
    return "empty";
  }

  if (directionIds.length < minimumComparisonDirectionCount) {
    return "under-minimum";
  }

  if (directionIds.length > maximumComparisonDirectionCount) {
    return "over-limit";
  }

  return "ready";
}

export function readComparisonSelection(input: {
  ids?: string | string[] | undefined;
  source?: string | undefined;
}): ComparisonSelection {
  const ids = Array.isArray(input.ids)
    ? input.ids
    : input.ids
      ? input.ids.split(",")
      : [];
  const directionIds = normalizeDirectionIds(ids);
  const source =
    input.source === "catalog" ||
    input.source === "direction-detail" ||
    input.source === "comparison-page"
      ? input.source
      : null;
  const state = resolveSelectionState(directionIds);

  logWithLevel(
    "comparison-selection",
    state === "over-limit" ? "warn" : "info",
    "Parsed comparison selection from search parameters.",
    {
      directionIds,
      selectionSize: directionIds.length,
      source,
      state,
    },
  );

  return {
    directionIds,
    source,
    state,
  };
}

export function buildComparisonHref(
  directionIds: string[],
  source: ComparisonEntrySource,
): string {
  const normalizedDirectionIds = normalizeDirectionIds(directionIds);
  const state = resolveSelectionState(normalizedDirectionIds);

  logWithLevel(
    "comparison-selection",
    normalizedDirectionIds.length > maximumComparisonDirectionCount
      ? "warn"
      : "debug",
    "Built comparison href from direction selection.",
    {
      directionIds: normalizedDirectionIds,
      selectionSize: normalizedDirectionIds.length,
      source,
      state,
    },
  );

  const searchParams = new URLSearchParams();

  if (normalizedDirectionIds.length > 0) {
    searchParams.set("ids", normalizedDirectionIds.join(","));
  }

  searchParams.set("source", source);

  return `/compare?${searchParams.toString()}`;
}

export function buildComparisonSelectionPath(
  pathname: string,
  directionIds: string[],
  source: ComparisonEntrySource,
): string {
  const normalizedDirectionIds = normalizeDirectionIds(directionIds);
  const searchParams = new URLSearchParams();

  if (normalizedDirectionIds.length > 0) {
    searchParams.set("ids", normalizedDirectionIds.join(","));
    searchParams.set("source", source);
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}
