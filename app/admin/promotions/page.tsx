import { redirect } from "next/navigation";

import { loadAdminDirectionPromotionsPageData } from "@/app/admin-direction-promotions-page-data";
import { DirectionPromotionsPanel } from "@/modules/admin";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export default async function AdminPromotionsPage() {
  try {
    const context = getDevAuthContext();
    await ensureAdminAccess(context);
    const data = await loadAdminDirectionPromotionsPageData();

    return (
      <main>
        <DirectionPromotionsPanel
          directionOptions={data.directionOptions}
          initialPromotions={data.promotions}
        />
      </main>
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/admin/forbidden");
    }

    throw error;
  }
}
