import { ensureAdminAccess } from "@/modules/auth";
import { AuthorizationError } from "@/modules/auth";

describe("ensureAdminAccess", () => {
  it("returns the auth context when the user is an admin", async () => {
    const context = {
      userId: "dev-admin-user",
      role: "admissions_admin" as const,
    };

    await expect(ensureAdminAccess(context)).resolves.toEqual(context);
  });

  it("throws when the role requirement is not satisfied", async () => {
    await expect(
      ensureAdminAccess({
        userId: "dev-analyst-user",
        role: "admissions_analyst",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
