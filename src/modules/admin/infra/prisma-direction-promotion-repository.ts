import type { PrismaClient } from "@prisma/client";

import { logWithLevel } from "@/shared/utils/logging";

import {
  type DirectionPromotionListFilters,
  type DirectionPromotionRepository,
  type DirectionPromotionSummary,
  type SaveDirectionPromotionInput,
  type UpdateDirectionPromotionInput,
  DirectionPromotionNotFoundError,
  isPromotionCurrentlyActive,
} from "../domain/direction-promotion";

function mapPromotionSummary(input: {
  id: string;
  directionId: string;
  status: "draft" | "active" | "inactive";
  priority: number;
  note: string;
  startsAt: Date | null;
  endsAt: Date | null;
  direction: {
    title: string;
    slug: string;
  };
}): DirectionPromotionSummary {
  return {
    id: input.id,
    directionId: input.directionId,
    directionTitle: input.direction.title,
    directionSlug: input.direction.slug,
    status: input.status,
    priority: input.priority,
    note: input.note,
    startsAt: input.startsAt?.toISOString() ?? null,
    endsAt: input.endsAt?.toISOString() ?? null,
    isCurrentlyActive: isPromotionCurrentlyActive({
      status: input.status,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    }),
  };
}

export class PrismaDirectionPromotionRepository implements DirectionPromotionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listPromotions(
    filters: DirectionPromotionListFilters,
  ): Promise<DirectionPromotionSummary[]> {
    logWithLevel(
      "prisma-direction-promotion-repository",
      "debug",
      "Loading direction promotions from Prisma.",
      {
        filters,
      },
    );

    const promotions = await this.prisma.directionPromotion.findMany({
      where: {
        status:
          filters.status && filters.status !== "all"
            ? filters.status
            : undefined,
      },
      orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
      include: {
        direction: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    const summaries = promotions
      .map(mapPromotionSummary)
      .filter((promotion) =>
        filters.activeOnly ? promotion.isCurrentlyActive : true,
      );

    logWithLevel(
      "prisma-direction-promotion-repository",
      "debug",
      "Resolved direction promotions from Prisma.",
      {
        total: summaries.length,
        ids: summaries.map((promotion) => promotion.id),
      },
    );

    return summaries;
  }

  async savePromotion(
    input: SaveDirectionPromotionInput,
  ): Promise<DirectionPromotionSummary> {
    logWithLevel(
      "prisma-direction-promotion-repository",
      "info",
      "Upserting direction promotion in Prisma.",
      {
        directionId: input.directionId,
        status: input.status,
        priority: input.priority,
      },
    );

    const promotion = await this.prisma.directionPromotion.upsert({
      where: {
        directionId: input.directionId,
      },
      update: {
        status: input.status,
        priority: input.priority,
        note: input.note,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
      },
      create: {
        directionId: input.directionId,
        status: input.status,
        priority: input.priority,
        note: input.note,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
      },
      include: {
        direction: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return mapPromotionSummary(promotion);
  }

  async updatePromotion(
    input: UpdateDirectionPromotionInput,
  ): Promise<DirectionPromotionSummary> {
    logWithLevel(
      "prisma-direction-promotion-repository",
      "info",
      "Updating direction promotion in Prisma.",
      {
        promotionId: input.promotionId,
        updatedFields: Object.keys(input).filter(
          (field) =>
            field !== "promotionId" &&
            input[field as keyof UpdateDirectionPromotionInput] !== undefined,
        ),
      },
    );

    try {
      const promotion = await this.prisma.directionPromotion.update({
        where: {
          id: input.promotionId,
        },
        data: {
          status: input.status,
          priority: input.priority,
          note: input.note,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
        },
        include: {
          direction: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });

      return mapPromotionSummary(promotion);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
      ) {
        throw new DirectionPromotionNotFoundError(input.promotionId);
      }

      throw error;
    }
  }
}
