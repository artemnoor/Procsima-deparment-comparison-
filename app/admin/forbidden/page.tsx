import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <main>
      <div className="card">
        <h2>Access denied</h2>
        <p className="muted">
          The current auth context does not satisfy the internal dashboard role
          requirement.
        </p>
        <p className="muted">
          For local development, use the dev auth path or set
          `ADMIN_DEV_ROLE=admissions_admin`.
        </p>
        <p>
          <Link href="/api/admin/dev-auth">Open dev auth info</Link>
        </p>
      </div>
    </main>
  );
}
