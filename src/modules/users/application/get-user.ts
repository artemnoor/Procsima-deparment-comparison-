import type { UserIdentity } from "@/shared/kernel/users";

import type { UserRepository } from "../domain/user-repository";

export async function getUserById(
  repository: UserRepository,
  userId: string,
): Promise<UserIdentity | null> {
  return repository.findById(userId);
}
