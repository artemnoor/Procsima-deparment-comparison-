import Link from "next/link";

import { createEventPublisher } from "@/app/event-publisher";
import { createDirectionComparisonRepository } from "@/app/public-direction-data";
import { publishEvent } from "@/modules/events";
import { getComparisonPageData } from "@/modules/comparison";
import { createDomainEvent } from "@/shared/kernel/events";
import { logWithLevel } from "@/shared/utils/logging";
import { LearningContentBlock } from "@/shared/ui/learning-content-block";

function renderComparisonState(state: string) {
  switch (state) {
    case "empty":
      return {
        eyebrow: "No selection yet",
        title: "Pick directions before opening comparison",
        description:
          "Start from the catalog or a direction page and add 2 to 4 directions to build a useful side-by-side view.",
      };
    case "under-minimum":
      return {
        eyebrow: "More directions needed",
        title: "Comparison needs at least two directions",
        description:
          "The current compare link contains only one direction. Add one or more additional directions from the catalog.",
      };
    case "over-limit":
      return {
        eyebrow: "Too many directions",
        title: "Comparison is limited to four directions",
        description:
          "Reduce the current selection to 2 to 4 directions so the differences stay readable.",
      };
    default:
      return {
        eyebrow: "Missing directions",
        title: "Some selected directions were not found",
        description:
          "One or more requested directions are missing in the active data source. Return to the catalog and rebuild the selection.",
      };
  }
}

export default async function ComparePage(props: {
  searchParams: Promise<{ ids?: string | string[]; source?: string }>;
}) {
  const searchParams = await props.searchParams;
  const repository = createDirectionComparisonRepository();
  const publisher = createEventPublisher();
  const comparisonPageData = await getComparisonPageData(repository, {
    ids: searchParams.ids,
    source: searchParams.source,
  });

  await publishEvent(
    publisher,
    createDomainEvent({
      type: "page_opened",
      payload: {
        route: "/compare",
        contour: "public",
        source: "page",
      },
    }),
  );

  logWithLevel("public-compare-page", "info", "Rendering comparison page.", {
    route: "/compare",
    state: comparisonPageData.state,
    directionIds: comparisonPageData.selection.directionIds,
    source: comparisonPageData.selection.source,
  });

  if (comparisonPageData.state === "ready" && comparisonPageData.comparison) {
    logWithLevel(
      "public-compare-page",
      "debug",
      "Resolved structured learning-content for comparison page.",
      {
        directionIds: comparisonPageData.comparison.directionIds,
        learningContent: comparisonPageData.directions.map((direction) => ({
          directionId: direction.id,
          outcomes: direction.learningContent.outcomes.length,
          technologies: direction.learningContent.technologies.length,
          practicalSkills: direction.learningContent.practicalSkills.length,
          studyFocuses: direction.learningContent.studyFocuses.length,
        })),
      },
    );

    await publishEvent(
      publisher,
      createDomainEvent({
        type: "compare_started",
        payload: {
          directionIds: comparisonPageData.selection.directionIds,
          source: comparisonPageData.selection.source ?? "comparison-page",
        },
      }),
    );

    await publishEvent(
      publisher,
      createDomainEvent({
        type: "comparison_run",
        payload: {
          directionIds: comparisonPageData.comparison.directionIds,
          comparedFields: comparisonPageData.comparison.comparedFields,
        },
      }),
    );
  }

  if (comparisonPageData.state !== "ready" || !comparisonPageData.comparison) {
    const comparisonState = renderComparisonState(comparisonPageData.state);

    return (
      <main>
        <div className="stack">
          <section className="card">
            <div className="sectionEyebrow">{comparisonState.eyebrow}</div>
            <h2 className="sectionTitle">{comparisonState.title}</h2>
            <p className="muted">{comparisonState.description}</p>
            <div className="catalogCardActions">
              <Link className="actionLink" href="/directions">
                Return to directions catalog
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="stack">
        <section className="card detailHero">
          <div className="sectionEyebrow">Applicant comparison flow</div>
          <div className="detailHeroHeader">
            <div>
              <h2 className="sectionTitle">Compare selected directions</h2>
              <p className="detailLead">
                Review program fit, cost, qualification, subject focus, and the
                axis-based contrast across the active mock-backed dataset.
              </p>
            </div>
            <div className="detailActionGroup">
              <Link className="secondaryActionLink" href="/directions">
                Add more directions
              </Link>
            </div>
          </div>
        </section>

        <section className="compareGrid" aria-label="Selected directions">
          {comparisonPageData.directions.map((direction) => (
            <article className="catalogCard" key={direction.id}>
              <div className="catalogMeta">
                <span className="chip">
                  {direction.context.code ?? "Code pending"}
                </span>
                {direction.context.department ? (
                  <span className="chip chipMuted">
                    {direction.context.department}
                  </span>
                ) : null}
              </div>
              <h3 className="cardTitle">{direction.title}</h3>
              <p className="catalogDescription">{direction.shortDescription}</p>
              <dl className="catalogFacts">
                <div>
                  <dt>Qualification</dt>
                  <dd>
                    {direction.context.qualification ?? "To be confirmed"}
                  </dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>
                    {direction.context.studyDuration ?? "To be confirmed"}
                  </dd>
                </div>
                <div>
                  <dt>Tuition</dt>
                  <dd>
                    {direction.context.tuitionPerYearRub
                      ? `${direction.context.tuitionPerYearRub.toLocaleString("en-US")} RUB`
                      : "To be confirmed"}
                  </dd>
                </div>
                <div>
                  <dt>Difficulty</dt>
                  <dd>
                    {direction.learningDifficulty
                      ? `${direction.learningDifficulty}/5`
                      : "To be confirmed"}
                  </dd>
                </div>
              </dl>
              <div className="subjectStack">
                {direction.subjects.slice(0, 3).map((subject) => (
                  <div className="subjectCard" key={subject.title}>
                    <h4 className="subsectionTitle">{subject.title}</h4>
                    <p className="muted">
                      {subject.subjectBlock ?? "General block"} •{" "}
                      {subject.hours} hours
                    </p>
                  </div>
                ))}
              </div>
              <LearningContentBlock
                learningContent={direction.learningContent}
                variant="compact"
              />
            </article>
          ))}
        </section>

        <section className="card">
          <div className="sectionEyebrow">MVP comparison dimensions</div>
          <h3 className="cardTitle">Shared criteria</h3>
          <div className="compareFieldList">
            {comparisonPageData.comparison.comparedFields.map((field) => (
              <span className="chip chipMuted" key={field}>
                {field}
              </span>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="sectionEyebrow">Learning content comparison</div>
          <h3 className="cardTitle">
            What changes from one direction to another
          </h3>
          <div className="compareLearningGrid">
            {comparisonPageData.directions.map((direction) => (
              <article className="compareLearningCard" key={direction.id}>
                <h4 className="subsectionTitle">{direction.title}</h4>
                <div className="learningTagList">
                  {direction.learningContent.technologies.map((technology) => (
                    <span
                      className="chip"
                      key={`${direction.id}-${technology.name}`}
                    >
                      {technology.name}
                    </span>
                  ))}
                </div>
                <ul className="detailList">
                  {direction.learningContent.practicalSkills.map((skill) => (
                    <li key={`${direction.id}-${skill.name}`}>{skill.name}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="sectionEyebrow">Axis comparison</div>
          <h3 className="cardTitle">How the selected directions differ</h3>
          <div className="compareMatrix">
            {comparisonPageData.comparison.differences.map((difference) => (
              <div className="compareMatrixRow" key={difference.axis}>
                <div className="compareMatrixAxis">{difference.axis}</div>
                <div className="compareMatrixValues">
                  {difference.values.map((value) => {
                    const matchedDirection = comparisonPageData.directions.find(
                      (direction) => direction.id === value.directionId,
                    );

                    return (
                      <div
                        className="compareMatrixValueCard"
                        key={value.directionId}
                      >
                        <span className="compareMatrixLabel">
                          {matchedDirection?.title ?? value.directionId}
                        </span>
                        <strong>{value.score}/5</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
