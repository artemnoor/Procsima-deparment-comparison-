import { env } from "@/env/server";
import type { RoleKey } from "@/shared/kernel/users";

import type { AuthContext } from "../domain/auth";

type HeaderLookup = {
  get(name: string): string | null;
};

function isRoleKey(value: string): value is RoleKey {
  return value === "admissions_admin" || value === "admissions_analyst";
}

function isDevAuthEnabled(): boolean {
  return env.ALLOW_DEV_AUTH === "true" && env.NODE_ENV !== "production";
}

export function getDevAuthContext(headers?: HeaderLookup): AuthContext | null {
  if (!isDevAuthEnabled()) {
    return null;
  }

  const headerUserId = headers?.get("x-dev-user-id");
  const headerRole = headers?.get("x-dev-role");

  const userId = headerUserId ?? env.ADMIN_DEV_USER_ID;
  const roleValue = headerRole ?? env.ADMIN_DEV_ROLE;

  if (!isRoleKey(roleValue)) {
    return null;
  }

  return {
    userId,
    role: roleValue,
  };
}
