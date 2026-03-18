import Link from "next/link";
import { redirect } from "next/navigation";

import { loadAdmissionsDashboard } from "@/app/admissions-dashboard-data";
import {
  AuthorizationError,
  ensureAdminAccess,
  getDevAuthContext,
} from "@/modules/auth";

const metricLabels = [
  { key: "totalEvents", label: "Total tracked events" },
  { key: "pageOpens", label: "Page opens" },
  { key: "directionOpens", label: "Direction opens" },
  { key: "compareStarts", label: "Compare starts" },
  { key: "comparisonRuns", label: "Comparison runs" },
  { key: "recommendationsGenerated", label: "Recommendations generated" },
] as const;

export default async function AdminDashboardPage(props: {
  searchParams: Promise<{
    from?: string | string[];
    to?: string | string[];
    days?: string | string[];
    limit?: string | string[];
  }>;
}) {
  try {
    const context = getDevAuthContext();
    const auth = await ensureAdminAccess(context);
    const searchParams = await props.searchParams;
    const dashboard = await loadAdmissionsDashboard(searchParams);

    return (
      <main>
        <div className="stack">
          <section className="card">
            <div className="sectionEyebrow">Internal contour</div>
            <h2 className="sectionTitle">Admissions dashboard</h2>
            <p className="muted">
              Internal dashboard contour is protected by the foundation auth
              skeleton and now renders the first analytics backend slice over
              collected applicant events.
            </p>
            <p className="muted">Current dev user: {auth.userId}</p>
            <p className="muted">Current role: {auth.role}</p>
            <p className="muted">
              Active window: {dashboard.filters.dateFrom} -{" "}
              {dashboard.filters.dateTo}
            </p>
            <p>
              <Link href="/api/admin/dashboard">
                Open protected admin API route
              </Link>
            </p>
          </section>

          <section
            className="statusGrid"
            aria-label="Dashboard summary metrics"
          >
            {metricLabels.map((metric) => (
              <article className="card" key={metric.key}>
                <h3 className="cardTitle">{metric.label}</h3>
                <p>{dashboard.summary[metric.key]}</p>
              </article>
            ))}
          </section>

          <section className="card">
            <h3 className="cardTitle">Top directions by interaction volume</h3>
            <p className="muted">
              These rankings combine direction opens, compare activity, and
              recommendation-linked dashboard events.
            </p>

            {dashboard.topDirections.length === 0 ? (
              <p className="muted">
                No dashboard direction interactions were recorded for the active
                filter window.
              </p>
            ) : (
              <div className="stack">
                {dashboard.topDirections.map((direction) => (
                  <article className="card" key={direction.directionId}>
                    <h4 className="cardTitle">{direction.title}</h4>
                    <p className="muted">Slug: {direction.slug}</p>
                    <p>Total interactions: {direction.interactionCount}</p>
                    <p className="muted">
                      Direction opens: {direction.breakdown.directionOpens}
                    </p>
                    <p className="muted">
                      Compare starts: {direction.breakdown.compareStarts}
                    </p>
                    <p className="muted">
                      Comparison runs: {direction.breakdown.comparisonRuns}
                    </p>
                    <p className="muted">
                      Recommendations generated:{" "}
                      {direction.breakdown.recommendationsGenerated}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
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
