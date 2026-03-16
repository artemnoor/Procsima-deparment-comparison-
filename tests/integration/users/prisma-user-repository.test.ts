import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaUserRepository } from "@/modules/users";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaUserRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("loads a user identity from the database", async () => {
    const repository = new PrismaUserRepository(integrationPrisma);

    const user = await repository.findById("dev-admin-user");

    expect(user).toEqual({
      id: "dev-admin-user",
      email: "admin@example.local",
      name: "Foundation Admin",
      role: "admissions_admin",
    });
  });
});
