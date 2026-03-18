import type { EventType, PrismaClient } from "@prisma/client";

import { logWithLevel } from "@/shared/utils/logging";

import type {
  AdmissionsDashboardDirectionMetric,
  AdmissionsDashboardEventRecord,
  AdmissionsDashboardFilters,
  AdmissionsDashboardRepository,
  AdmissionsDashboardSummary,
} from "../domain/admissions-dashboard";

type MutableDirectionMetric = {
  directionId: string;
  interactionCount: number;
  breakdown: AdmissionsDashboardDirectionMetric["breakdown"];
};

const summaryKeyByEventType: Record<
  EventType,
  keyof AdmissionsDashboardSummary
> = {
  page_opened: "pageOpens",
  direction_opened: "directionOpens",
  compare_started: "compareStarts",
  comparison_run: "comparisonRuns",
  recommendation_generated: "recommendationsGenerated",
};

function createEmptySummary(): AdmissionsDashboardSummary {
  return {
    totalEvents: 0,
    pageOpens: 0,
    directionOpens: 0,
    compareStarts: 0,
    comparisonRuns: 0,
    recommendationsGenerated: 0,
  };
}

function createEmptyDirectionMetric(
  directionId: string,
): MutableDirectionMetric {
  return {
    directionId,
    interactionCount: 0,
    breakdown: {
      directionOpens: 0,
      compareStarts: 0,
      comparisonRuns: 0,
      recommendationsGenerated: 0,
    },
  };
}

function extractDirectionIds(event: AdmissionsDashboardEventRecord): string[] {
  const directionIds = new Set<string>();

  if (event.directionId) {
    directionIds.add(event.directionId);
  }

  if (
    event.payload &&
    typeof event.payload === "object" &&
    !Array.isArray(event.payload) &&
    "directionIds" in event.payload
  ) {
    const payloadDirectionIds = event.payload.directionIds;

    if (Array.isArray(payloadDirectionIds)) {
      payloadDirectionIds
        .filter((value): value is string => typeof value === "string")
        .forEach((value) => directionIds.add(value));
    }
  }

  return [...directionIds];
}

export class PrismaAdmissionsDashboardRepository implements AdmissionsDashboardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSnapshot(filters: AdmissionsDashboardFilters) {
    logWithLevel(
      "prisma-admissions-dashboard-repository",
      "debug",
      "Loading dashboard analytics events from Prisma.",
      {
        dateFrom: filters.dateFrom.toISOString(),
        dateTo: filters.dateTo.toISOString(),
        topDirectionsLimit: filters.topDirectionsLimit,
      },
    );

    const events = await this.prisma.event.findMany({
      where: {
        createdAt: {
          gte: filters.dateFrom,
          lte: filters.dateTo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        type: true,
        directionId: true,
        payload: true,
        createdAt: true,
      },
    });

    const summary = createEmptySummary();
    const directionMetrics = new Map<string, MutableDirectionMetric>();

    for (const event of events) {
      summary.totalEvents += 1;
      summary[summaryKeyByEventType[event.type]] += 1;

      const relatedDirectionIds = extractDirectionIds(event);

      for (const directionId of relatedDirectionIds) {
        const metric =
          directionMetrics.get(directionId) ??
          createEmptyDirectionMetric(directionId);

        metric.interactionCount += 1;

        if (event.type === "direction_opened") {
          metric.breakdown.directionOpens += 1;
        }

        if (event.type === "compare_started") {
          metric.breakdown.compareStarts += 1;
        }

        if (event.type === "comparison_run") {
          metric.breakdown.comparisonRuns += 1;
        }

        if (event.type === "recommendation_generated") {
          metric.breakdown.recommendationsGenerated += 1;
        }

        directionMetrics.set(directionId, metric);
      }
    }

    const rankedDirectionIds = [...directionMetrics.values()]
      .sort((left, right) => right.interactionCount - left.interactionCount)
      .slice(0, filters.topDirectionsLimit)
      .map((metric) => metric.directionId);

    const directions = await this.prisma.direction.findMany({
      where: {
        id: {
          in: rankedDirectionIds,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    const directionsById = new Map(
      directions.map((direction) => [direction.id, direction]),
    );

    const topDirections: AdmissionsDashboardDirectionMetric[] =
      rankedDirectionIds
        .map((directionId) => {
          const metric = directionMetrics.get(directionId);
          const direction = directionsById.get(directionId);

          if (!metric || !direction) {
            return null;
          }

          return {
            directionId,
            title: direction.title,
            slug: direction.slug,
            interactionCount: metric.interactionCount,
            breakdown: metric.breakdown,
          };
        })
        .filter(
          (metric): metric is AdmissionsDashboardDirectionMetric =>
            metric !== null,
        );

    logWithLevel(
      "prisma-admissions-dashboard-repository",
      "debug",
      "Dashboard analytics aggregates built from Prisma events.",
      {
        summary,
        eventCount: events.length,
        topDirectionIds: topDirections.map(
          (direction) => direction.directionId,
        ),
      },
    );

    return {
      summary,
      topDirections,
    };
  }
}
