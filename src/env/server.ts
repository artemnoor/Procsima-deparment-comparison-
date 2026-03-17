import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .default(
      "postgresql://postgres:postgres@localhost:5433/nps_choice_platform?schema=public",
    ),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  LOG_LEVEL: z.string().default("info"),
  ADMIN_DEV_USER_ID: z.string().min(1).default("dev-admin-user"),
  ADMIN_DEV_ROLE: z.string().min(1).default("admissions_admin"),
  ALLOW_DEV_AUTH: z.enum(["true", "false"]).default("true"),
  NPS_DISABLE_EVENT_WRITE: z.enum(["true", "false"]).default("false"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  ADMIN_DEV_USER_ID: process.env.ADMIN_DEV_USER_ID,
  ADMIN_DEV_ROLE: process.env.ADMIN_DEV_ROLE,
  ALLOW_DEV_AUTH: process.env.ALLOW_DEV_AUTH,
  NPS_DISABLE_EVENT_WRITE: process.env.NPS_DISABLE_EVENT_WRITE,
});
