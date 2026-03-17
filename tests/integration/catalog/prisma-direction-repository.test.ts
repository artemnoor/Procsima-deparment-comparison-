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
      "program-09-02-07",
      "program-10-02-05",
    ]);
    expect(directions[0]?.context.department).toBe(
      "Кафедра программирования и информационных систем",
    );
    expect(directions[0]?.context.code).toBe("09.02.07");
    expect(directions[0]?.context.budgetSeats).toBe(60);
  });
});
