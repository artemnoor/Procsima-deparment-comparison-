import { requireRole } from "@/modules/auth";
import { AuthorizationError } from "@/modules/auth";

describe("requireRole", () => {
  it("allows access when the required role matches", async () => {
    await expect(
      requireRole(
        {
          userId: "dev-admin-user",
          role: "admissions_admin",
        },
        "admissions_admin",
      ),
    ).resolves.toBeUndefined();
  });

  it("rejects access when role does not match", async () => {
    await expect(
      requireRole(
        {
          userId: "dev-analyst-user",
          role: "admissions_analyst",
        },
        "admissions_admin",
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("rejects access when context is missing", async () => {
    await expect(requireRole(null, "admissions_admin")).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});
