import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaEventPublisher, publishEvent } from "@/modules/events";
import { createDomainEvent } from "@/shared/kernel/events";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaEventPublisher", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("persists a domain event in the database", async () => {
    const publisher = new PrismaEventPublisher(integrationPrisma);

    await publishEvent(
      publisher,
      createDomainEvent({
        type: "page_opened",
        userId: "dev-admin-user",
        payload: {
          route: "/directions",
          contour: "public",
          source: "api",
        },
      }),
    );

    const events = await integrationPrisma.event.findMany();

    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("page_opened");
    expect(events[0]?.userId).toBe("dev-admin-user");
  });
});
