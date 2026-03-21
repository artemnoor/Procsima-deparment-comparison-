import Link from "next/link";

import { createEventPublisher } from "@/app/event-publisher";
import { createRecommendationCandidateRepository } from "@/app/public-direction-data";
import { buildComparisonHref } from "@/modules/comparison";
import { publishEvent } from "@/modules/events";
import {
  generateProfileTestRecommendations,
  parseProfileTestSubmission,
  profileTestQuestions,
  type MultiSelectProfileTestQuestion,
  type ProfileTestQuestion,
} from "@/modules/recommendation";
import { createDomainEvent } from "@/shared/kernel/events";
import { logWithLevel } from "@/shared/utils/logging";

function readSelectedValues(
  searchParams: Record<string, string | string[] | undefined>,
  questionId: string,
): string[] {
  const value = searchParams[questionId];

  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

function renderStateMessage(state: "empty" | "incomplete" | "invalid") {
  switch (state) {
    case "incomplete":
      return {
        eyebrow: "Не все ответы заполнены",
        title: "Ответьте на обязательные вопросы",
        description:
          "Перед рекомендацией нужно ответить на все обязательные вопросы. Итог должен опираться на полный профиль, а не на случайное предположение.",
      };
    case "invalid":
      return {
        eyebrow: "Некорректная отправка",
        title: "Не удалось интерпретировать один или несколько ответов",
        description:
          "Анкета отклонила хотя бы одну комбинацию ответов. Сбросьте форму или выберите только допустимые варианты.",
      };
    default:
      return {
        eyebrow: "Профтест",
        title: "Ответьте на короткий опрос",
        description:
          "Рекомендация строится детерминированно и прозрачно. В ней не смешиваются алгоритм подбора и редакционное продвижение.",
      };
  }
}

function renderQuestion(
  question: ProfileTestQuestion,
  selectedValues: string[],
) {
  const isMultiSelect = question.kind === "multi-select";

  return (
    <fieldset className="card profileQuestionCard" key={question.id}>
      <legend className="profileQuestionLegend">{question.prompt}</legend>
      <p className="muted profileQuestionDescription">{question.description}</p>
      {isMultiSelect ? (
        <p className="sectionEyebrow profileQuestionMeta">
          Выберите от{" "}
          {(question as MultiSelectProfileTestQuestion).minSelections} до{" "}
          {(question as MultiSelectProfileTestQuestion).maxSelections}
        </p>
      ) : null}
      <div className="profileOptionGrid">
        {question.options.map((option) => {
          const inputType = isMultiSelect ? "checkbox" : "radio";
          const checked = selectedValues.includes(option.id);

          return (
            <label className="profileOptionCard" key={option.id}>
              <input
                defaultChecked={checked}
                name={question.id}
                type={inputType}
                value={option.id}
              />
              <div>
                <strong>{option.label}</strong>
                <p className="muted">{option.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default async function ProfileTestPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const publisher = createEventPublisher();
  const parsedSubmission = parseProfileTestSubmission(
    profileTestQuestions,
    searchParams,
  );
  const activeQuestionIds = Object.keys(searchParams).filter((key) =>
    profileTestQuestions.some((question) => question.id === key),
  );
  const stateMessage = renderStateMessage(
    parsedSubmission.state === "complete" ? "empty" : parsedSubmission.state,
  );

  await publishEvent(
    publisher,
    createDomainEvent({
      type: "page_opened",
      payload: {
        route: "/profile-test",
        contour: "public",
        source: "page",
      },
    }),
  );

  logWithLevel(
    "public-profile-test-page",
    "info",
    "Rendering profile test page.",
    {
      route: "/profile-test",
      submissionState: parsedSubmission.state,
      activeQuestionIds,
    },
  );

  const recommendationRepository = createRecommendationCandidateRepository();
  const recommendationCandidates =
    await recommendationRepository.listCandidates();
  const recommendationResult = generateProfileTestRecommendations(
    parsedSubmission,
    recommendationCandidates,
  );
  const compareHref =
    recommendationResult.recommendedDirectionIds.length >= 2
      ? buildComparisonHref(
          recommendationResult.recommendedDirectionIds,
          "recommendation-flow",
        )
      : null;

  if (parsedSubmission.state === "complete") {
    await publishEvent(
      publisher,
      createDomainEvent({
        type: "recommendation_generated",
        payload: {
          directionIds: recommendationResult.recommendedDirectionIds,
          explanation: recommendationResult.summary,
          sourceRoute: "/profile-test",
          dominantAxes: recommendationResult.profile.dominantAxes,
        },
      }),
    );

    logWithLevel(
      "public-profile-test-page",
      "info",
      "Rendered profile test recommendation results.",
      {
        route: "/profile-test",
        recommendationIds: recommendationResult.recommendedDirectionIds,
        dominantAxes: recommendationResult.profile.dominantAxes,
        compareHref,
      },
    );
  } else if (parsedSubmission.issues.length > 0) {
    logWithLevel(
      "public-profile-test-page",
      parsedSubmission.state === "invalid" ? "warn" : "info",
      "Profile test submission requires user correction.",
      {
        route: "/profile-test",
        issues: parsedSubmission.issues,
      },
    );
  }

  return (
    <main>
      <div className="stack">
        <section className="card profileHero">
          <div className="sectionEyebrow">{stateMessage.eyebrow}</div>
          <div className="detailHeroHeader">
            <div>
              <h2 className="sectionTitle">{stateMessage.title}</h2>
              <p className="detailLead">{stateMessage.description}</p>
            </div>
            <div className="detailActionGroup">
              <Link className="secondaryActionLink" href="/directions">
                Сначала посмотреть направления
              </Link>
              <Link className="secondaryActionLink" href="/profile-test">
                Сбросить анкету
              </Link>
            </div>
          </div>
        </section>

        {parsedSubmission.issues.length > 0 ? (
          <section className="card">
            <div className="sectionEyebrow">Обратная связь по анкете</div>
            <h3 className="cardTitle">Что нужно исправить</h3>
            <ul className="detailList">
              {parsedSubmission.issues.map((issue) => (
                <li key={`${issue.questionId}-${issue.reason}`}>
                  <strong>{issue.questionId}</strong>: {issue.reason}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <form action="/profile-test" className="stack" method="get">
          {profileTestQuestions.map((question) =>
            renderQuestion(
              question,
              readSelectedValues(searchParams, question.id),
            ),
          )}
          <section className="card profileActionBar">
            <p className="muted">
              Анкета в MVP специально короткая. Логика рекомендаций
              детерминированная и объяснимая, без адаптивного или
              промо-смещения.
            </p>
            <div className="compareSelectionActions">
              <button className="actionButton" type="submit">
                Показать рекомендации
              </button>
              <Link className="secondaryActionLink" href="/compare">
                Открыть сравнение без теста
              </Link>
            </div>
          </section>
        </form>

        {parsedSubmission.state === "complete" ? (
          <>
            <section className="card">
              <div className="sectionEyebrow">Сводка рекомендации</div>
              <h3 className="cardTitle">Ваш наиболее выраженный профиль</h3>
              <p className="detailLead">{recommendationResult.summary}</p>
              <div className="compareFieldList">
                {recommendationResult.profile.dominantAxes.map((axis) => (
                  <span className="chip chipMuted" key={axis}>
                    {axis}
                  </span>
                ))}
              </div>
            </section>

            <section
              className="profileRecommendationGrid"
              aria-label="Рекомендации профтеста"
            >
              {recommendationResult.matches.map((match) => (
                <article className="catalogCard" key={match.directionId}>
                  <div className="catalogCardHeader">
                    <div>
                      <div className="sectionEyebrow">
                        Рекомендуемое направление
                      </div>
                      <h3 className="cardTitle">{match.title}</h3>
                    </div>
                    <span className="focusBadge">{match.confidence}</span>
                  </div>
                  <p className="catalogDescription">
                    Баллы: {match.score}. Рекомендация основана на ваших ответах
                    и текущем наборе данных по направлениям.
                  </p>
                  <ul className="detailList">
                    {match.explanation.map((item) => (
                      <li key={`${match.directionId}-${item}`}>{item}</li>
                    ))}
                  </ul>
                  <div className="catalogCardActions catalogCardActionsSplit">
                    <Link
                      className="secondaryActionLink"
                      href={`/directions/${match.slug}`}
                    >
                      Открыть страницу направления
                    </Link>
                    <Link
                      className="actionLink"
                      href={compareHref ?? "/compare"}
                    >
                      Сравнить рекомендованный набор
                    </Link>
                  </div>
                </article>
              ))}
            </section>

            {compareHref ? (
              <section className="card">
                <div className="sectionEyebrow">Следующий шаг</div>
                <h3 className="cardTitle">Сразу перейти к сравнению</h3>
                <p className="muted">
                  Переход в сравнение сохраняет источник рекомендации, чтобы
                  аналитика различала сценарии из каталога и из профтеста.
                </p>
                <div className="catalogCardActions">
                  <Link className="actionLink" href={compareHref}>
                    Сравнить все рекомендованные направления
                  </Link>
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
