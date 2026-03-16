export const roleKeys = ["admissions_admin", "admissions_analyst"] as const;

export type RoleKey = (typeof roleKeys)[number];

export type UserIdentity = {
  id: string;
  email: string | null;
  name: string | null;
  role: RoleKey;
};
