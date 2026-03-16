import type { UserIdentity } from "@/shared/kernel/users";

export interface UserRepository {
  findById(userId: string): Promise<UserIdentity | null>;
}
