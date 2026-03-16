import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getDevAuthContext } from "@/modules/auth";

export async function GET() {
  const headerStore = await headers();
  const context = getDevAuthContext({
    get(name: string) {
      return headerStore.get(name);
    },
  });

  return NextResponse.json({
    enabled: context !== null,
    currentContext: context,
    usage: {
      default:
        "Use ALLOW_DEV_AUTH=true and ADMIN_DEV_ROLE=admissions_admin for local access.",
      headerOverrideUser: "x-dev-user-id",
      headerOverrideRole: "x-dev-role",
    },
  });
}
