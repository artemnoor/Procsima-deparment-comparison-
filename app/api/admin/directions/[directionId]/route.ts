import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/app/db";
import {
  DirectionContentNotFoundError,
  DirectionContentValidationError,
  PrismaDirectionContentRepository,
  updateAdminDirection,
} from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export async function PUT(
  request: Request,
  props: { params: Promise<{ directionId: string }> },
) {
  try {
    const headerStore = await headers();
    const context = getDevAuthContext({
      get(name: string) {
        return headerStore.get(name);
      },
    });
    const auth = await ensureAdminAccess(context);
    const { directionId } = await props.params;
    const body = (await request.json()) as Record<string, unknown>;
    const direction = await updateAdminDirection(
      new PrismaDirectionContentRepository(prisma),
      directionId,
      body,
    );

    return NextResponse.json({
      status: "ok",
      scope: "internal",
      userId: auth.userId,
      role: auth.role,
      direction,
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

    if (error instanceof DirectionContentValidationError) {
      return NextResponse.json(
        {
          status: "invalid",
          scope: "internal",
          reason: error.message,
        },
        { status: 400 },
      );
    }

    if (error instanceof DirectionContentNotFoundError) {
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
