import Link from "next/link";

import { createEventPublisher } from "@/app/event-publisher";
import {
  createDirectionComparisonRepository,
  createDirectionDetailsRepository,
} from "@/app/public-direction-data";
import {
  buildComparisonSelectionPath,
  maximumComparisonDirectionCount,
  readComparisonSelection,
} from "@/modules/comparison";
import { getDirectionDetails } from "@/modules/direction-pages";
import { publishEvent } from "@/modules/events";
import { createDomainEvent } from "@/shared/kernel/events";
import { logWithLevel } from "@/shared/utils/logging";
import { CompareSelectionPanel } from "@/shared/ui/compare-selection-panel";
import { FactGrid } from "@/shared/ui/fact-grid";
import { LearningContentBlock } from "@/shared/ui/learning-content-block";

export default async function DirectionDetailPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ids?: string | string[]; source?: string }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  logWithLevel(
    "public-direction-detail-page",
    "info",
    "Rendering direction detail page.",
    {
      route: `/directions/${slug}`,
      slug,
    },
  );

  const repository = createDirectionDetailsRepository();
  const comparisonRepository = createDirectionComparisonRepository();
  const publisher = createEventPublisher();
  const direction = await getDirectionDetails(repository, slug);
  const selection = readComparisonSelection(searchParams);

  if (!direction) {
    logWithLevel(
      "public-direction-detail-page",
      "warn",
      "Direction detail was not found.",
      {
        route: `/directions/${slug}`,
        slug,
      },
    );

    return (
      <main>
        <div className="stack">
          <section className="card">
            <div className="sectionEyebrow">Direction not found</div>
            <h2 className="sectionTitle">
              This direction is not available in the active source
            </h2>
            <p className="muted">
              The requested slug does not exist in the current applicant-facing
              dataset.
            </p>
            <div className="catalogCardActions">
              <Link className="actionLink" href="/directions">
                Back to catalog
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  await publishEvent(
    publisher,
    createDomainEvent({
      type: "direction_opened",
      directionId: direction.id,
      payload: {
        slug: direction.slug,
        route: `/directions/${slug}`,
      },
    }),
  );

  const isSelected = selection.directionIds.includes(direction.id);
  const selectionIsFull =
    selection.directionIds.length >= maximumComparisonDirectionCount;
  const nextSelectionIds = isSelected
    ? selection.directionIds.filter(
        (selectedDirectionId) => selectedDirectionId !== direction.id,
      )
    : [...selection.directionIds, direction.id];
  const selectionActionHref = buildComparisonSelectionPath(
    `/directions/${slug}`,
    nextSelectionIds,
    "direction-detail",
  );
  const resolvedSelectedDirections =
    selection.directionIds.length > 0
      ? await comparisonRepository.findDirectionsByIds(selection.directionIds)
      : [];
  const selectedDirectionTitles = new Map(
    resolvedSelectedDirections.map((selectedDirection) => [
      selectedDirection.id,
      selectedDirection.title,
    ]),
  );
  const selectedDirections = selection.directionIds.map(
    (selectedDirectionId) => ({
      id: selectedDirectionId,
      title:
        selectedDirectionTitles.get(selectedDirectionId) ??
        (selectedDirectionId === direction.id
          ? direction.title
          : selectedDirectionId),
    }),
  );

  logWithLevel(
    "public-direction-detail-page",
    "debug",
    "Resolved structured learning-content sections for direction detail page.",
    {
      route: `/directions/${slug}`,
      directionId: direction.id,
      outcomes: direction.learningContent.outcomes.length,
      technologies: direction.learningContent.technologies.length,
      practicalSkills: direction.learningContent.practicalSkills.length,
      studyFocuses: direction.learningContent.studyFocuses.length,
    },
  );

  return (
    <main>
      <div className="stack">
        {selection.directionIds.length > 0 ? (
          <CompareSelectionPanel
            pathname={`/directions/${slug}`}
            selectedDirectionIds={selection.directionIds}
            selectedDirections={selectedDirections}
            source="direction-detail"
          />
        ) : null}

        <section className="card detailHero">
          <div className="sectionEyebrow">
            {direction.context.code ?? "Program"}
          </div>
          <div className="detailHeroHeader">
            <div>
              <h2 className="sectionTitle">{direction.title}</h2>
              <p className="detailLead">
                {direction.heroDescription ?? direction.shortDescription}
              </p>
            </div>
            <div className="detailActionGroup">
              {isSelected ? (
                <Link
                  className="secondaryActionLink"
                  href={selectionActionHref}
                >
                  Remove from compare
                </Link>
              ) : selectionIsFull ? (
                <span className="disabledAction">Selection full</span>
              ) : (
                <Link className="actionLink" href={selectionActionHref}>
                  Add to compare
                </Link>
              )}
              <Link className="secondaryActionLink" href="/directions">
                Back to catalog
              </Link>
            </div>
          </div>
        </section>

        <section className="detailGrid">
          <article className="card">
            <h3 className="cardTitle">Program snapshot</h3>
            <FactGrid
              items={[
                {
                  label: "Qualification",
                  value: direction.context.qualification ?? "To be confirmed",
                },
                {
                  label: "Department",
                  value: direction.context.department ?? "To be confirmed",
                },
                {
                  label: "Education level",
                  value: direction.context.educationLevel ?? "To be confirmed",
                },
                {
                  label: "Study form",
                  value: direction.context.studyForm ?? "To be confirmed",
                },
                {
                  label: "Duration",
                  value: direction.context.studyDuration ?? "To be confirmed",
                },
                {
                  label: "Difficulty",
                  value: direction.learningDifficulty
                    ? `${direction.learningDifficulty}/5`
                    : "To be confirmed",
                },
                {
                  label: "Budget / paid seats",
                  value: `${direction.context.budgetSeats ?? "—"} / ${
                    direction.context.paidSeats ?? "—"
                  }`,
                },
                {
                  label: "Tuition per year",
                  value: direction.context.tuitionPerYearRub
                    ? `${direction.context.tuitionPerYearRub.toLocaleString("en-US")} RUB`
                    : "To be confirmed",
                },
              ]}
            />
          </article>

          <article className="card">
            <LearningContentBlock learningContent={direction.learningContent} />
            <h4 className="subsectionTitle">Target fit</h4>
            <p className="muted">
              {direction.targetFit ?? "Positioning is still being refined."}
            </p>
          </article>
        </section>

        <section className="detailGrid">
          <article className="card">
            <h3 className="cardTitle">Key differences</h3>
            <ul className="detailList">
              {direction.keyDifferences.map((difference) => (
                <li key={difference}>{difference}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3 className="cardTitle">Career outcomes</h3>
            {direction.careerRoles.length > 0 ? (
              <ul className="detailList">
                {direction.careerRoles.map((careerRole) => (
                  <li key={careerRole.slug}>
                    <strong>{careerRole.title}</strong>
                    {careerRole.comment ? ` — ${careerRole.comment}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="detailList">
                {direction.careerPaths.map((careerPath) => (
                  <li key={careerPath}>{careerPath}</li>
                ))}
              </ul>
            )}
          </article>
        </section>

        {direction.sections.length > 0 ? (
          <section className="detailGrid">
            {direction.sections.map((section) => (
              <article className="card" key={section.sectionKey}>
                <h3 className="cardTitle">{section.title}</h3>
                {section.body ? <p className="muted">{section.body}</p> : null}
                {section.items.length > 0 ? (
                  <ul className="detailList">
                    {section.items.map((item) => (
                      <li key={`${section.sectionKey}-${item.title}`}>
                        <strong>{item.title}</strong>
                        {item.description ? ` — ${item.description}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        <section className="detailGrid">
          <article className="card">
            <h3 className="cardTitle">Subject highlights</h3>
            <div className="subjectStack">
              {direction.subjects.map((subject) => (
                <div className="subjectCard" key={subject.title}>
                  <div className="catalogMeta">
                    {subject.subjectBlock ? (
                      <span className="chip">{subject.subjectBlock}</span>
                    ) : null}
                    {subject.department ? (
                      <span className="chip chipMuted">
                        {subject.department}
                      </span>
                    ) : null}
                  </div>
                  <h4 className="subsectionTitle">{subject.title}</h4>
                  <p className="muted">{subject.hours} academic hours</p>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h3 className="cardTitle">Admissions by year</h3>
            <div className="scoreHistory">
              {direction.admissionStats.length > 0
                ? direction.admissionStats.map((stat) => (
                    <div className="scoreHistoryRow" key={stat.year}>
                      <span>{stat.year}</span>
                      <span>
                        Seats: {stat.budgetPlaces ?? "—"} /{" "}
                        {stat.paidPlaces ?? "—"}
                      </span>
                      <span>
                        Passing: {stat.passingScoreBudget ?? "—"} /{" "}
                        {stat.passingScorePaid ?? "—"}
                      </span>
                    </div>
                  ))
                : direction.passingScores.map((score) => (
                    <div className="scoreHistoryRow" key={score.year}>
                      <span>{score.year}</span>
                      <span>Budget: {score.budget ?? "—"}</span>
                      <span>Paid: {score.paid ?? "—"}</span>
                    </div>
                  ))}
            </div>
            <div className="detailActionGroup detailActionGroupTight">
              {direction.documents.map((document) => (
                <Link
                  className="secondaryActionLink"
                  href={document.url}
                  key={`${document.type}-${document.url}`}
                >
                  {document.title}
                </Link>
              ))}
              {direction.documents.length === 0 &&
              direction.programDescriptionUrl ? (
                <Link
                  className="secondaryActionLink"
                  href={direction.programDescriptionUrl}
                >
                  Program description
                </Link>
              ) : null}
              {direction.curriculumUrl ? (
                <Link
                  className="secondaryActionLink"
                  href={direction.curriculumUrl}
                >
                  Curriculum
                </Link>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
