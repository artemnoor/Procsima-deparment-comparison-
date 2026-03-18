import { redirect } from "next/navigation";

import { loadAdminDirectionsPageData } from "@/app/admin-directions-page-data";
import { AdminDirectionsPanel } from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export default async function AdminDirectionsPage() {
  try {
    const context = getDevAuthContext();
    await ensureAdminAccess(context);
    const data = await loadAdminDirectionsPageData();

    return (
      <main>
        <AdminDirectionsPanel initialDirections={data.directions} />
      </main>
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/admin/forbidden");
    }

    throw error;
  }
}
