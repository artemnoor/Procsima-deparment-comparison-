import type { RoleKey } from "@/shared/kernel/users";

import type { AuthContext } from "../domain/auth";
import { requireRole } from "./require-role";

export async function ensureAdminAccess(
  context: AuthContext | null,
  requiredRole: RoleKey = "admissions_admin",
): Promise<AuthContext> {
  await requireRole(context, requiredRole);

  return context as AuthContext;
}
