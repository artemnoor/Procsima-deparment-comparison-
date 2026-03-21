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
        eyebrow: "Ничего не выбрано",
        title: "Сначала выберите направления",
        description:
          "Перейдите в каталог или на страницу направления и добавьте от 2 до 4 программ, чтобы открыть полезное сравнение.",
      };
    case "under-minimum":
      return {
        eyebrow: "Нужно больше направлений",
        title: "Для сравнения нужны минимум два направления",
        description:
          "В текущей ссылке на сравнение только одно направление. Добавьте ещё хотя бы одно направление из каталога.",
      };
    case "over-limit":
      return {
        eyebrow: "Слишком много направлений",
        title: "Можно сравнивать не более четырёх направлений",
        description:
          "Сократите выбор до 2–4 направлений, чтобы сравнение оставалось читаемым.",
      };
    default:
      return {
        eyebrow: "Не все направления найдены",
        title: "Часть выбранных направлений не найдена",
        description:
          "Одно или несколько запрошенных направлений отсутствуют в активном источнике данных. Вернитесь в каталог и соберите выбор заново.",
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
                Вернуться в каталог направлений
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
          <div className="sectionEyebrow">Сценарий сравнения</div>
          <div className="detailHeroHeader">
            <div>
              <h2 className="sectionTitle">Сравнение выбранных направлений</h2>
              <p className="detailLead">
                Сопоставьте формат обучения, предметный фокус, контекст
                поступления и ключевые различия между выбранными программами.
              </p>
            </div>
            <div className="detailActionGroup">
              <Link className="secondaryActionLink" href="/directions">
                Добавить направления
              </Link>
            </div>
          </div>
        </section>

        <section className="compareGrid" aria-label="Выбранные направления">
          {comparisonPageData.directions.map((direction) => (
            <article className="catalogCard" key={direction.id}>
              <div className="catalogMeta">
                <span className="chip">
                  {direction.context.code ?? "Код уточняется"}
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
                  <dt>Квалификация</dt>
                  <dd>{direction.context.qualification ?? "Будет уточнено"}</dd>
                </div>
                <div>
                  <dt>Уровень / форма</dt>
                  <dd>
                    {direction.context.educationLevel ?? "Будет уточнено"} /{" "}
                    {direction.context.studyForm ?? "Будет уточнено"}
                  </dd>
                </div>
                <div>
                  <dt>Срок обучения</dt>
                  <dd>{direction.context.studyDuration ?? "Будет уточнено"}</dd>
                </div>
                <div>
                  <dt>Стоимость</dt>
                  <dd>
                    {direction.context.tuitionPerYearRub
                      ? `${direction.context.tuitionPerYearRub.toLocaleString("ru-RU")} ₽`
                      : "Будет уточнено"}
                  </dd>
                </div>
                <div>
                  <dt>Сложность</dt>
                  <dd>
                    {direction.learningDifficulty
                      ? `${direction.learningDifficulty}/5`
                      : "Будет уточнено"}
                  </dd>
                </div>
              </dl>
              <div className="subjectStack">
                {direction.subjects.slice(0, 3).map((subject) => (
                  <div className="subjectCard" key={subject.title}>
                    <h4 className="subsectionTitle">{subject.title}</h4>
                    <p className="muted">
                      {subject.subjectBlock ?? "Общий блок"} • {subject.hours}{" "}
                      часов
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
          <div className="sectionEyebrow">Критерии сравнения MVP</div>
          <h3 className="cardTitle">Общие критерии</h3>
          <div className="compareFieldList">
            {comparisonPageData.comparison.comparedFields.map((field) => (
              <span className="chip chipMuted" key={field}>
                {field}
              </span>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="sectionEyebrow">Сравнение содержания обучения</div>
          <h3 className="cardTitle">
            Что меняется от одного направления к другому
          </h3>
          <div className="compareLearningGrid">
            {comparisonPageData.directions.map((direction) => (
              <article className="compareLearningCard" key={direction.id}>
                <h4 className="subsectionTitle">{direction.title}</h4>
                {direction.careerRoles.length > 0 ? (
                  <p className="muted">
                    Роли:{" "}
                    {direction.careerRoles.map((role) => role.title).join(", ")}
                  </p>
                ) : null}
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
          <div className="sectionEyebrow">Сравнение по осям</div>
          <h3 className="cardTitle">Чем отличаются выбранные направления</h3>
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

        <section className="card">
          <div className="sectionEyebrow">Поступление и документы</div>
          <h3 className="cardTitle">Что опубликовано по каждому направлению</h3>
          <div className="compareLearningGrid">
            {comparisonPageData.directions.map((direction) => {
              const latestStat = [...direction.admissionStats].sort(
                (left, right) => right.year - left.year,
              )[0];

              return (
                <article
                  className="compareLearningCard"
                  key={`${direction.id}-docs`}
                >
                  <h4 className="subsectionTitle">{direction.title}</h4>
                  <p className="muted">
                    {latestStat
                      ? `${latestStat.year}: места ${latestStat.budgetPlaces ?? "—"} / ${latestStat.paidPlaces ?? "—"}, проходной балл ${latestStat.passingScoreBudget ?? "—"} / ${latestStat.passingScorePaid ?? "—"}`
                      : "История приёма пока не опубликована."}
                  </p>
                  <ul className="detailList">
                    {direction.documents.length > 0 ? (
                      direction.documents.map((document) => (
                        <li key={`${direction.id}-${document.url}`}>
                          <Link href={document.url}>{document.title}</Link>
                        </li>
                      ))
                    ) : (
                      <li>Документы пока не опубликованы.</li>
                    )}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
