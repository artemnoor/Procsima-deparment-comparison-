import type { PromotionStatus } from "@prisma/client";
import { z } from "zod";

import { logWithLevel } from "@/shared/utils/logging";

import {
  type DirectionPromotionListFilters,
  type DirectionPromotionRepository,
  type DirectionPromotionSummary,
  DirectionPromotionValidationError,
  validatePromotionWindow,
} from "../domain/direction-promotion";

const promotionStatusSchema = z.enum(["draft", "active", "inactive"]);

const createPromotionSchema = z.object({
  directionId: z.string().trim().min(1),
  status: promotionStatusSchema.default("draft"),
  priority: z.coerce.number().int().min(1).max(999).default(100),
  note: z.string().trim().min(3).max(500),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
});

const updatePromotionSchema = z
  .object({
    status: promotionStatusSchema.optional(),
    priority: z.coerce.number().int().min(1).max(999).optional(),
    note: z.string().trim().min(3).max(500).optional(),
    startsAt: z.string().trim().nullable().optional(),
    endsAt: z.string().trim().nullable().optional(),
  })
  .refine(
    (value) =>
      value.status !== undefined ||
      value.priority !== undefined ||
      value.note !== undefined ||
      value.startsAt !== undefined ||
      value.endsAt !== undefined,
    {
      message:
        "At least one promotion field must be provided for an update request.",
    },
  );

const listPromotionFiltersSchema = z.object({
  status: z.enum(["draft", "active", "inactive", "all"]).optional(),
  activeOnly: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional(),
});

function parseOptionalDate(
  value: string | null | undefined,
  fieldName: string,
): Date | null {
  if (value === undefined) {
    return null;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new DirectionPromotionValidationError(
      `${fieldName} must be a valid ISO date.`,
    );
  }

  return parsedDate;
}

export type DirectionPromotionCreatePayload = {
  directionId: string;
  status?: PromotionStatus;
  priority?: number;
  note: string;
  startsAt?: string;
  endsAt?: string;
};

export type DirectionPromotionUpdatePayload = {
  status?: PromotionStatus;
  priority?: number;
  note?: string;
  startsAt?: string | null;
  endsAt?: string | null;
};

export async function getDirectionPromotions(
  repository: DirectionPromotionRepository,
  rawFilters: Record<string, string | string[] | undefined>,
): Promise<DirectionPromotionSummary[]> {
  const parsedFilters = listPromotionFiltersSchema.parse({
    status: Array.isArray(rawFilters.status)
      ? rawFilters.status[0]
      : rawFilters.status,
    activeOnly: Array.isArray(rawFilters.activeOnly)
      ? rawFilters.activeOnly[0]
      : rawFilters.activeOnly,
  });

  const filters: DirectionPromotionListFilters = {
    status: parsedFilters.status,
    activeOnly:
      parsedFilters.activeOnly === true || parsedFilters.activeOnly === "true",
  };

  logWithLevel(
    "direction-promotion-service",
    "info",
    "Loading direction promotions for admin contour.",
    {
      filters,
    },
  );

  return repository.listPromotions(filters);
}

export async function saveDirectionPromotion(
  repository: DirectionPromotionRepository,
  payload: DirectionPromotionCreatePayload,
): Promise<DirectionPromotionSummary> {
  const parsedPayload = createPromotionSchema.parse(payload);
  const startsAt = parseOptionalDate(parsedPayload.startsAt, "startsAt");
  const endsAt = parseOptionalDate(parsedPayload.endsAt, "endsAt");

  validatePromotionWindow(startsAt, endsAt);

  logWithLevel(
    "direction-promotion-service",
    "info",
    "Saving direction promotion through admin service.",
    {
      directionId: parsedPayload.directionId,
      status: parsedPayload.status,
      priority: parsedPayload.priority,
    },
  );

  return repository.savePromotion({
    directionId: parsedPayload.directionId,
    status: parsedPayload.status,
    priority: parsedPayload.priority,
    note: parsedPayload.note,
    startsAt,
    endsAt,
  });
}

export async function updateDirectionPromotion(
  repository: DirectionPromotionRepository,
  promotionId: string,
  payload: DirectionPromotionUpdatePayload,
): Promise<DirectionPromotionSummary> {
  const parsedPayload = updatePromotionSchema.parse(payload);
  const startsAt =
    parsedPayload.startsAt === undefined
      ? undefined
      : parseOptionalDate(parsedPayload.startsAt, "startsAt");
  const endsAt =
    parsedPayload.endsAt === undefined
      ? undefined
      : parseOptionalDate(parsedPayload.endsAt, "endsAt");

  validatePromotionWindow(startsAt ?? null, endsAt ?? null);

  logWithLevel(
    "direction-promotion-service",
    "info",
    "Updating direction promotion through admin service.",
    {
      promotionId,
      updatedFields: Object.keys(parsedPayload),
    },
  );

  return repository.updatePromotion({
    promotionId,
    status: parsedPayload.status,
    priority: parsedPayload.priority,
    note: parsedPayload.note,
    startsAt,
    endsAt,
  });
}
