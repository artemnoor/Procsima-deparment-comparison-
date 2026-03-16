import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

export default async function AdminDashboardPage() {
  try {
    const context = getDevAuthContext();
    const auth = await ensureAdminAccess(context);

    return (
      <main>
        <div className="card">
          <h2>Dashboard placeholder</h2>
          <p className="muted">
            Internal dashboard contour is protected by the foundation auth
            skeleton.
          </p>
          <p className="muted">Current dev user: {auth.userId}</p>
          <p className="muted">Current role: {auth.role}</p>
          <p>
            <Link href="/api/admin/dashboard">
              Open protected admin API route
            </Link>
          </p>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/admin/forbidden");
    }

    throw error;
  }
}
