import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  PrismaDirectionPromotionRepository,
  getDirectionPromotions,
  saveDirectionPromotion,
  updateDirectionPromotion,
} from "@/modules/admin";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaDirectionPromotionRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("lists active promotions and lets admin update promotion state", async () => {
    const repository = new PrismaDirectionPromotionRepository(
      integrationPrisma,
    );

    const activePromotions = await getDirectionPromotions(repository, {
      activeOnly: "true",
    });

    expect(activePromotions).toHaveLength(1);
    expect(activePromotions[0]).toMatchObject({
      directionId: "direction-09-02-07",
      directionSlug: "program-09-02-07",
      status: "active",
      isCurrentlyActive: true,
    });

    const savedDraft = await saveDirectionPromotion(repository, {
      directionId: "direction-10-02-05",
      status: "draft",
      priority: 30,
      note: "Keep prepared for a future cybersecurity admissions wave.",
    });

    expect(savedDraft).toMatchObject({
      directionId: "direction-10-02-05",
      status: "draft",
      isCurrentlyActive: false,
    });

    const activatedPromotion = await updateDirectionPromotion(
      repository,
      savedDraft.id,
      {
        status: "active",
        priority: 8,
      },
    );

    expect(activatedPromotion).toMatchObject({
      directionId: "direction-10-02-05",
      status: "active",
      priority: 8,
      isCurrentlyActive: true,
    });
  });
});
