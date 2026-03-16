import { PrismaClient } from "@prisma/client";

declare global {
  var __npsPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__npsPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__npsPrisma__ = prisma;
}
