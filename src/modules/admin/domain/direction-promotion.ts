import type { PromotionStatus } from "@prisma/client";

export class DirectionPromotionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectionPromotionValidationError";
  }
}

export class DirectionPromotionNotFoundError extends Error {
  constructor(promotionId: string) {
    super(`Direction promotion not found: ${promotionId}`);
    this.name = "DirectionPromotionNotFoundError";
  }
}

export type DirectionPromotionSummary = {
  id: string;
  directionId: string;
  directionTitle: string;
  directionSlug: string;
  status: PromotionStatus;
  priority: number;
  note: string;
  startsAt: string | null;
  endsAt: string | null;
  isCurrentlyActive: boolean;
};

export type DirectionPromotionListFilters = {
  status?: PromotionStatus | "all";
  activeOnly?: boolean;
};

export type SaveDirectionPromotionInput = {
  directionId: string;
  status: PromotionStatus;
  priority: number;
  note: string;
  startsAt: Date | null;
  endsAt: Date | null;
};

export type UpdateDirectionPromotionInput = {
  promotionId: string;
  status?: PromotionStatus;
  priority?: number;
  note?: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

export interface DirectionPromotionRepository {
  listPromotions(
    filters: DirectionPromotionListFilters,
  ): Promise<DirectionPromotionSummary[]>;
  savePromotion(
    input: SaveDirectionPromotionInput,
  ): Promise<DirectionPromotionSummary>;
  updatePromotion(
    input: UpdateDirectionPromotionInput,
  ): Promise<DirectionPromotionSummary>;
}

export function validatePromotionWindow(
  startsAt: Date | null,
  endsAt: Date | null,
): void {
  if (startsAt && Number.isNaN(startsAt.getTime())) {
    throw new DirectionPromotionValidationError(
      "Promotion start date must be a valid ISO date.",
    );
  }

  if (endsAt && Number.isNaN(endsAt.getTime())) {
    throw new DirectionPromotionValidationError(
      "Promotion end date must be a valid ISO date.",
    );
  }

  if (startsAt && endsAt && startsAt > endsAt) {
    throw new DirectionPromotionValidationError(
      "Promotion end date cannot be earlier than start date.",
    );
  }
}

export function isPromotionCurrentlyActive(input: {
  status: PromotionStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();

  if (input.status !== "active") {
    return false;
  }

  if (input.startsAt && input.startsAt > now) {
    return false;
  }

  if (input.endsAt && input.endsAt < now) {
    return false;
  }

  return true;
}
