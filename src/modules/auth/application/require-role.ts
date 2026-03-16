import type { RoleKey } from "@/shared/kernel/users";

import { AuthorizationError } from "../domain/auth";

export async function requireRole(
  context: { userId: string; role: RoleKey } | null,
  requiredRole: RoleKey,
): Promise<void> {
  if (!context || context.role !== requiredRole) {
    throw new AuthorizationError(
      `Required role "${requiredRole}" was not satisfied for the current user.`,
    );
  }
}
