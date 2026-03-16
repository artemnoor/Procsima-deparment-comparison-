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
        eyebrow: "Incomplete answers",
        title: "Finish the required questions",
        description:
          "Answer every required question before we rank directions. The result should be based on the full applicant profile, not a partial guess.",
      };
    case "invalid":
      return {
        eyebrow: "Invalid submission",
        title: "We could not interpret one or more answers",
        description:
          "The questionnaire rejected at least one answer combination. Reset the form or choose only the listed options.",
      };
    default:
      return {
        eyebrow: "Profile test flow",
        title: "Answer a short guided questionnaire",
        description:
          "The first result is deterministic and explainable. It does not mix recommendation logic with editorial promotion.",
      };
  }
}

function renderQuestion(question: ProfileTestQuestion, selectedValues: string[]) {
  const isMultiSelect = question.kind === "multi-select";

  return (
    <fieldset className="card profileQuestionCard" key={question.id}>
      <legend className="profileQuestionLegend">{question.prompt}</legend>
      <p className="muted profileQuestionDescription">{question.description}</p>
      {isMultiSelect ? (
        <p className="sectionEyebrow profileQuestionMeta">
          Select {`${(question as MultiSelectProfileTestQuestion).minSelections} to ${(question as MultiSelectProfileTestQuestion).maxSelections}`}
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

  logWithLevel("public-profile-test-page", "info", "Rendering profile test page.", {
    route: "/profile-test",
    submissionState: parsedSubmission.state,
    activeQuestionIds,
  });

  const recommendationRepository = createRecommendationCandidateRepository();
  const recommendationCandidates = await recommendationRepository.listCandidates();
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
                Browse directions first
              </Link>
              <Link className="secondaryActionLink" href="/profile-test">
                Reset questionnaire
              </Link>
            </div>
          </div>
        </section>

        {parsedSubmission.issues.length > 0 ? (
          <section className="card">
            <div className="sectionEyebrow">Submission feedback</div>
            <h3 className="cardTitle">What needs attention</h3>
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
            renderQuestion(question, readSelectedValues(searchParams, question.id)),
          )}
          <section className="card profileActionBar">
            <p className="muted">
              The MVP questionnaire is short by design. Recommendation logic is
              deterministic and explainable, not adaptive or promotion-driven.
            </p>
            <div className="compareSelectionActions">
              <button className="actionButton" type="submit">
                Show recommendations
              </button>
              <Link className="secondaryActionLink" href="/compare">
                Open compare without the test
              </Link>
            </div>
          </section>
        </form>

        {parsedSubmission.state === "complete" ? (
          <>
            <section className="card">
              <div className="sectionEyebrow">Recommendation summary</div>
              <h3 className="cardTitle">Your strongest direction pattern</h3>
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
              aria-label="Profile test recommendations"
            >
              {recommendationResult.matches.map((match) => (
                <article className="catalogCard" key={match.directionId}>
                  <div className="catalogCardHeader">
                    <div>
                      <div className="sectionEyebrow">Recommended direction</div>
                      <h3 className="cardTitle">{match.title}</h3>
                    </div>
                    <span className="focusBadge">{match.confidence}</span>
                  </div>
                  <p className="catalogDescription">
                    Score: {match.score}. This recommendation is based on your
                    submitted answers and the current direction dataset.
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
                      Open direction page
                    </Link>
                    <Link className="actionLink" href={compareHref ?? "/compare"}>
                      Compare recommended set
                    </Link>
                  </div>
                </article>
              ))}
            </section>

            {compareHref ? (
              <section className="card">
                <div className="sectionEyebrow">Next step</div>
                <h3 className="cardTitle">
                  Move directly into the comparison flow
                </h3>
                <p className="muted">
                  The compare handoff keeps the recommendation source marker so
                  analytics can separate catalog-driven and profile-test-driven
                  compare journeys.
                </p>
                <div className="catalogCardActions">
                  <Link className="actionLink" href={compareHref}>
                    Compare all recommended directions
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
