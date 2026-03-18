import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/app/db";
import {
  DirectionContentValidationError,
  PrismaDirectionContentRepository,
  createAdminDirection,
  getAdminDirections,
} from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export async function GET() {
  try {
    const headerStore = await headers();
    const context = getDevAuthContext({
      get(name: string) {
        return headerStore.get(name);
      },
    });
    const auth = await ensureAdminAccess(context);
    const directions = await getAdminDirections(
      new PrismaDirectionContentRepository(prisma),
    );

    return NextResponse.json({
      status: "ok",
      scope: "internal",
      userId: auth.userId,
      role: auth.role,
      directions,
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
    const body = (await request.json()) as Record<string, unknown>;
    const direction = await createAdminDirection(
      new PrismaDirectionContentRepository(prisma),
      body,
    );

    return NextResponse.json(
      {
        status: "ok",
        scope: "internal",
        userId: auth.userId,
        role: auth.role,
        direction,
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

    throw error;
  }
}
