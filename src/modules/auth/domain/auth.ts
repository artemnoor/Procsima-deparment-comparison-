import type { RoleKey } from "@/shared/kernel/users";

export class AuthorizationError extends Error {
  constructor(message = "Access denied") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export type AuthContext = {
  userId: string;
  role: RoleKey;
};
