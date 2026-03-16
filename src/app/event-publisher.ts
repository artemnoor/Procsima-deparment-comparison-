import { env } from "@/env/server";
import {
  NoopEventPublisher,
  PrismaEventPublisher,
  type EventPublisher,
} from "@/modules/events";
import { logWithLevel } from "@/shared/utils/logging";

import { prisma } from "./db";

export function createEventPublisher(): EventPublisher {
  if (env.NPS_DISABLE_EVENT_WRITE === "true") {
    logWithLevel(
      "event-publisher",
      "warn",
      "Using noop event publisher because event writes are disabled.",
      {
        nodeEnv: env.NODE_ENV,
        disableEventWrite: env.NPS_DISABLE_EVENT_WRITE,
      },
    );

    return new NoopEventPublisher();
  }

  return new PrismaEventPublisher(prisma);
}
