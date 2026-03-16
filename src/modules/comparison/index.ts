export {
  buildComparisonHref,
  buildComparisonSelectionPath,
  maximumComparisonDirectionCount,
  minimumComparisonDirectionCount,
  readComparisonSelection,
} from "./application/comparison-selection";
export { compareDirections } from "./application/compare-directions";
export { getComparisonPageData } from "./application/get-comparison-page-data";
export type { DirectionComparisonRepository } from "./domain/direction-comparison-repository";
export type { ComparisonInput, ComparisonResult } from "./domain/comparison";
export type {
  ComparisonEntrySource,
  ComparisonSelection,
  ComparisonSelectionState,
} from "./application/comparison-selection";
export type {
  ComparisonPageData,
  ComparisonPageState,
} from "./application/get-comparison-page-data";
export { MockDirectionComparisonRepository } from "./infra/mock-direction-comparison-repository";
export { PrismaDirectionComparisonRepository } from "./infra/prisma-direction-comparison-repository";
