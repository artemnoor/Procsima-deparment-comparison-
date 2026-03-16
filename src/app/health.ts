import { env } from "@/env/server";

import { prisma } from "./db";

export type HealthStatus = {
  status: "ok" | "degraded";
  service: string;
  checks: {
    env: "ok";
    db: "ok" | "error";
  };
};

export async function getReadinessStatus(): Promise<HealthStatus> {
  try {
    // Simple connectivity check that exercises Prisma and the database connection.
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      service: "nps-choice-platform",
      checks: {
        env: env.DATABASE_URL ? "ok" : "ok",
        db: "ok",
      },
    };
  } catch {
    return {
      status: "degraded",
      service: "nps-choice-platform",
      checks: {
        env: "ok",
        db: "error",
      },
    };
  }
}
