import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/app/db";
import {
  DirectionPromotionNotFoundError,
  DirectionPromotionValidationError,
  PrismaDirectionPromotionRepository,
  updateDirectionPromotion,
} from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ promotionId: string }> },
) {
  try {
    const headerStore = await headers();
    const context = getDevAuthContext({
      get(name: string) {
        return headerStore.get(name);
      },
    });

    const auth = await ensureAdminAccess(context);
    const { promotionId } = await props.params;
    const body = (await request.json()) as {
      status?: "draft" | "active" | "inactive";
      priority?: number;
      note?: string;
      startsAt?: string | null;
      endsAt?: string | null;
    };
    const promotion = await updateDirectionPromotion(
      new PrismaDirectionPromotionRepository(prisma),
      promotionId,
      body,
    );

    return NextResponse.json({
      status: "ok",
      scope: "internal",
      userId: auth.userId,
      role: auth.role,
      promotion,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          status: "forbidden",
          scope: "internal",
          reason: error.message,
        },
        { status: 403 },
      );
    }

    if (error instanceof DirectionPromotionValidationError) {
      return NextResponse.json(
        {
          status: "invalid",
          scope: "internal",
          reason: error.message,
        },
        { status: 400 },
      );
    }

    if (error instanceof DirectionPromotionNotFoundError) {
      return NextResponse.json(
        {
          status: "not-found",
          scope: "internal",
          reason: error.message,
        },
        { status: 404 },
      );
    }

    throw error;
  }
}
