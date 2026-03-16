import { createEventPublisher } from "@/app/event-publisher";
import { readComparisonSelection } from "@/modules/comparison";
import { createDirectionCatalogRepository } from "@/app/public-direction-data";
import { listDirections } from "@/modules/catalog";
import { publishEvent } from "@/modules/events";
import { createDomainEvent } from "@/shared/kernel/events";
import { logWithLevel } from "@/shared/utils/logging";
import { CompareSelectionPanel } from "@/shared/ui/compare-selection-panel";
import { DirectionCard } from "@/shared/ui/direction-card";

export default async function DirectionsPage(props: {
  searchParams: Promise<{ ids?: string | string[]; source?: string }>;
}) {
  const searchParams = await props.searchParams;
  logWithLevel(
    "public-directions-page",
    "info",
    "Rendering directions catalog page.",
    {
      route: "/directions",
    },
  );

  const repository = createDirectionCatalogRepository();
  const publisher = createEventPublisher();
  const directions = await listDirections(repository);
  const selection = readComparisonSelection(searchParams);
  const selectedDirections = directions.filter((direction) =>
    selection.directionIds.includes(direction.id),
  );

  await publishEvent(
    publisher,
    createDomainEvent({
      type: "page_opened",
      payload: {
        route: "/directions",
        contour: "public",
        source: "page",
      },
    }),
  );

  if (directions.length === 0) {
    logWithLevel(
      "public-directions-page",
      "warn",
      "Directions catalog is empty.",
      {
        route: "/directions",
      },
    );
  }

  return (
    <main>
      <div className="stack">
        <section className="card">
          <div className="sectionEyebrow">Applicant flow</div>
          <h2 className="sectionTitle">Directions catalog</h2>
          <p className="muted">
            Explore the current mock-backed set of NPS directions, compare study
            focus, and prepare for a more detailed side-by-side decision flow.
          </p>
        </section>

        {directions.length === 0 ? (
          <section className="card">
            <h3 className="cardTitle">No directions available yet</h3>
            <p className="muted">
              The public catalog is connected, but the active source returned no
              direction records.
            </p>
          </section>
        ) : (
          <>
            {selection.directionIds.length > 0 ? (
              <CompareSelectionPanel
                pathname="/directions"
                selectedDirectionIds={selection.directionIds}
                selectedDirections={selectedDirections.map((direction) => ({
                  id: direction.id,
                  title: direction.title,
                }))}
                source="catalog"
              />
            ) : null}

            <section className="catalogGrid" aria-label="Directions catalog">
              {directions.map((direction) => (
                <DirectionCard
                  direction={direction}
                  key={direction.id}
                  selectedDirectionIds={selection.directionIds}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
