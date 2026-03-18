import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { loadAdmissionsDashboard } from "@/app/admissions-dashboard-data";
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
    const { searchParams } = new URL(request.url);
    const dashboard = await loadAdmissionsDashboard({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      days: searchParams.get("days") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    return NextResponse.json({
      status: "ok",
      scope: "internal",
      userId: auth.userId,
      role: auth.role,
      dashboard,
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
