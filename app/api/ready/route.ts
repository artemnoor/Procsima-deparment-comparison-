import { NextResponse } from "next/server";

import { getReadinessStatus } from "@/app/health";

export async function GET() {
  const readiness = await getReadinessStatus();

  return NextResponse.json(
    {
      ...readiness,
      contours: ["public", "internal"],
    },
    {
      status: readiness.status === "ok" ? 200 : 503,
    },
  );
}
