import { z } from "zod";

import { logWithLevel } from "@/shared/utils/logging";

import type {
  AdmissionsDashboardFilterSnapshot,
  AdmissionsDashboardFilters,
  AdmissionsDashboardRawFilters,
  AdmissionsDashboardRepository,
  AdmissionsDashboardSnapshot,
} from "../domain/admissions-dashboard";

const rollingWindowDefaults = {
  days: 30,
  topDirectionsLimit: 5,
  minDays: 1,
  maxDays: 180,
  minLimit: 1,
  maxLimit: 10,
} as const;

const filterSchema = z.object({
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  days: z.coerce
    .number()
    .int()
    .min(rollingWindowDefaults.minDays)
    .max(rollingWindowDefaults.maxDays)
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .min(rollingWindowDefaults.minLimit)
    .max(rollingWindowDefaults.maxLimit)
    .optional(),
});

function getFirstValue(input?: string | string[]): string | undefined {
  if (Array.isArray(input)) {
    return input[0];
  }

  return input;
}

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

function buildRollingWindowFilters(now: Date, days: number, limit: number) {
  const dateTo = now;
  const dateFrom = new Date(now);
  dateFrom.setUTCDate(dateFrom.getUTCDate() - days);

  return {
    dateFrom,
    dateTo,
    windowDays: days,
    source: "rolling-window" as const,
    topDirectionsLimit: limit,
  };
}

export function normalizeAdmissionsDashboardFilters(
  rawFilters: AdmissionsDashboardRawFilters,
): AdmissionsDashboardFilters {
  const now = new Date();
  const parsedFilters = filterSchema.safeParse({
    from: getFirstValue(rawFilters.from),
    to: getFirstValue(rawFilters.to),
    days: getFirstValue(rawFilters.days),
    limit: getFirstValue(rawFilters.limit),
  });

  if (!parsedFilters.success) {
    logWithLevel(
      "admin-dashboard-service",
      "warn",
      "Invalid dashboard filters received. Falling back to rolling window defaults.",
      {
        issues: parsedFilters.error.flatten().fieldErrors,
      },
    );

    return buildRollingWindowFilters(
      now,
      rollingWindowDefaults.days,
      rollingWindowDefaults.topDirectionsLimit,
    );
  }

  const { from, to, days, limit } = parsedFilters.data;
  const resolvedLimit = limit ?? rollingWindowDefaults.topDirectionsLimit;

  if (from && to) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    if (isValidDate(dateFrom) && isValidDate(dateTo) && dateFrom <= dateTo) {
      const windowDays = Math.max(
        1,
        Math.ceil(
          (dateTo.getTime() - dateFrom.getTime()) / (24 * 60 * 60 * 1000),
        ),
      );

      return {
        dateFrom,
        dateTo,
        windowDays,
        source: "explicit-range",
        topDirectionsLimit: resolvedLimit,
      };
    }

    logWithLevel(
      "admin-dashboard-service",
      "warn",
      "Dashboard date range could not be applied. Falling back to rolling window defaults.",
      {
        from,
        to,
      },
    );
  }

  return buildRollingWindowFilters(
    now,
    days ?? rollingWindowDefaults.days,
    resolvedLimit,
  );
}

function serializeFilters(
  filters: AdmissionsDashboardFilters,
): AdmissionsDashboardFilterSnapshot {
  return {
    dateFrom: filters.dateFrom.toISOString(),
    dateTo: filters.dateTo.toISOString(),
    windowDays: filters.windowDays,
    source: filters.source,
    topDirectionsLimit: filters.topDirectionsLimit,
  };
}

export async function getAdmissionsDashboard(
  repository: AdmissionsDashboardRepository,
  rawFilters: AdmissionsDashboardRawFilters,
): Promise<AdmissionsDashboardSnapshot> {
  const filters = normalizeAdmissionsDashboardFilters(rawFilters);

  logWithLevel(
    "admin-dashboard-service",
    "info",
    "Resolving admissions dashboard snapshot.",
    {
      filters: serializeFilters(filters),
    },
  );

  const snapshot = await repository.getSnapshot(filters);

  const dashboard = {
    filters: serializeFilters(filters),
    ...snapshot,
  };

  logWithLevel(
    "admin-dashboard-service",
    "debug",
    "Admissions dashboard snapshot resolved.",
    {
      summary: dashboard.summary,
      topDirectionIds: dashboard.topDirections.map(
        (direction) => direction.directionId,
      ),
    },
  );

  return dashboard;
}
