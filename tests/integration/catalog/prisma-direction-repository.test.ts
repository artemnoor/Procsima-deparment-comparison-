import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaDirectionCatalogRepository } from "@/modules/catalog";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaDirectionCatalogRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("lists directions from the database in title order", async () => {
    const repository = new PrismaDirectionCatalogRepository(integrationPrisma);

    const directions = await repository.listDirections();

    expect(directions).toHaveLength(2);
    expect(directions.map((direction) => direction.slug)).toEqual([
      "data-analytics",
      "software-engineering",
    ]);
  });
});
