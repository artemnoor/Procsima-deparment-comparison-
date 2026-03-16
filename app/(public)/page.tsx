export default function HomePage() {
  return (
    <main>
      <div className="stack">
        <section className="card">
          <h2>Foundation home</h2>
          <p className="muted">
            This is the public shell. Feature modules should plug into this
            contour instead of creating their own application skeleton.
          </p>
        </section>
        <section className="statusGrid">
          <article className="card">
            <h3>Public contour</h3>
            <p className="muted">
              Catalog, direction pages, comparison, recommendation.
            </p>
          </article>
          <article className="card">
            <h3>Internal contour</h3>
            <p className="muted">
              Dashboard, analytics, protected staff tooling.
            </p>
          </article>
          <article className="card">
            <h3>Foundation status</h3>
            <p className="muted">
              Routing skeleton and module entry points are in place.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
