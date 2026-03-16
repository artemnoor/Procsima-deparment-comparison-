import type { DirectionAxis } from "./direction";

export const eventTypes = [
  "page_opened",
  "direction_opened",
  "compare_started",
  "comparison_run",
  "recommendation_generated",
] as const;

export type DomainEventType = (typeof eventTypes)[number];

export type PageOpenedPayload = {
  route: string;
  contour: "public" | "internal";
  source: "page" | "api";
};

export type DirectionOpenedPayload = {
  slug: string;
  route: string;
};

export type CompareStartedPayload = {
  directionIds: string[];
  source:
    | "catalog"
    | "direction-detail"
    | "comparison-page"
    | "recommendation-flow";
};

export type ComparisonRunPayload = {
  directionIds: string[];
  comparedFields: string[];
};

export type RecommendationGeneratedPayload = {
  directionIds: string[];
  explanation: string;
  sourceRoute: "/profile-test";
  dominantAxes: DirectionAxis[];
};

export type DomainEventPayloadMap = {
  page_opened: PageOpenedPayload;
  direction_opened: DirectionOpenedPayload;
  compare_started: CompareStartedPayload;
  comparison_run: ComparisonRunPayload;
  recommendation_generated: RecommendationGeneratedPayload;
};

export type DomainEvent<TType extends DomainEventType = DomainEventType> = {
  type: TType;
  userId?: string;
  directionId?: string;
  payload: DomainEventPayloadMap[TType];
  occurredAt: string;
};

export function createDomainEvent<TType extends DomainEventType>(input: {
  type: TType;
  userId?: string;
  directionId?: string;
  payload: DomainEventPayloadMap[TType];
}): DomainEvent<TType> {
  return {
    ...input,
    occurredAt: new Date().toISOString(),
  };
}
