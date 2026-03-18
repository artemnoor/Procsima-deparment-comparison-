import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/app/db";
import {
  DirectionPromotionValidationError,
  PrismaDirectionPromotionRepository,
  getDirectionPromotions,
  saveDirectionPromotion,
} from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export async function GET(request: Request) {
  try {
    const headerStore = await headers();
    const context = getDevAuthContext({
      get(name: string) {
        return headerStore.get(name);
      },
    });

    const auth = await ensureAdminAccess(context);
    const url = new URL(request.url);
    const promotions = await getDirectionPromotions(
      new PrismaDirectionPromotionRepository(prisma),
      {
        status: url.searchParams.get("status") ?? undefined,
        activeOnly: url.searchParams.get("activeOnly") ?? undefined,
      },
    );

    return NextResponse.json({
      status: "ok",
      scope: "internal",
      userId: auth.userId,
      role: auth.role,
      promotions,
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

    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const headerStore = await headers();
    const context = getDevAuthContext({
      get(name: string) {
        return headerStore.get(name);
      },
    });

    const auth = await ensureAdminAccess(context);
    const body = (await request.json()) as {
      directionId?: string;
      status?: "draft" | "active" | "inactive";
      priority?: number;
      note?: string;
      startsAt?: string;
      endsAt?: string;
    };
    const promotion = await saveDirectionPromotion(
      new PrismaDirectionPromotionRepository(prisma),
      {
        directionId: body.directionId ?? "",
        status: body.status,
        priority: body.priority,
        note: body.note ?? "",
        startsAt: body.startsAt,
        endsAt: body.endsAt,
      },
    );

    return NextResponse.json(
      {
        status: "ok",
        scope: "internal",
        userId: auth.userId,
        role: auth.role,
        promotion,
      },
      { status: 201 },
    );
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

    throw error;
  }
}
