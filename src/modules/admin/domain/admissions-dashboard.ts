import type { EventType, Prisma } from "@prisma/client";

export type AdmissionsDashboardRawFilters = {
  from?: string | string[];
  to?: string | string[];
  days?: string | string[];
  limit?: string | string[];
};

export type AdmissionsDashboardFilters = {
  dateFrom: Date;
  dateTo: Date;
  windowDays: number;
  source: "rolling-window" | "explicit-range";
  topDirectionsLimit: number;
};

export type AdmissionsDashboardFilterSnapshot = {
  dateFrom: string;
  dateTo: string;
  windowDays: number;
  source: "rolling-window" | "explicit-range";
  topDirectionsLimit: number;
};

export type AdmissionsDashboardSummary = {
  totalEvents: number;
  pageOpens: number;
  directionOpens: number;
  compareStarts: number;
  comparisonRuns: number;
  recommendationsGenerated: number;
};

export type AdmissionsDashboardDirectionBreakdown = {
  directionOpens: number;
  compareStarts: number;
  comparisonRuns: number;
  recommendationsGenerated: number;
};

export type AdmissionsDashboardDirectionMetric = {
  directionId: string;
  title: string;
  slug: string;
  interactionCount: number;
  breakdown: AdmissionsDashboardDirectionBreakdown;
};

export type AdmissionsDashboardSnapshot = {
  filters: AdmissionsDashboardFilterSnapshot;
  summary: AdmissionsDashboardSummary;
  topDirections: AdmissionsDashboardDirectionMetric[];
};

export type AdmissionsDashboardEventRecord = {
  type: EventType;
  directionId: string | null;
  payload: Prisma.JsonValue;
  createdAt: Date;
};

export interface AdmissionsDashboardRepository {
  getSnapshot(
    filters: AdmissionsDashboardFilters,
  ): Promise<Omit<AdmissionsDashboardSnapshot, "filters">>;
}
