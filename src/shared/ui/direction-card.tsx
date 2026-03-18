import Link from "next/link";

import type { DirectionSummary } from "@/shared/kernel/direction";
import {
  buildComparisonSelectionPath,
  maximumComparisonDirectionCount,
  type ComparisonEntrySource,
} from "@/modules/comparison";

type DirectionCardProps = {
  direction: DirectionSummary;
  selectionPathname?: string;
  selectionSource?: ComparisonEntrySource;
  selectedDirectionIds?: string[];
};

export function DirectionCard(props: DirectionCardProps) {
  const {
    direction,
    selectionPathname = "/directions",
    selectionSource = "catalog",
    selectedDirectionIds = [],
  } = props;
  const isSelected = selectedDirectionIds.includes(direction.id);
  const selectionIsFull =
    selectedDirectionIds.length >= maximumComparisonDirectionCount;
  const nextSelectionIds = isSelected
    ? selectedDirectionIds.filter(
        (selectedDirectionId) => selectedDirectionId !== direction.id,
      )
    : [...selectedDirectionIds, direction.id];
  const selectionHref = buildComparisonSelectionPath(
    selectionPathname,
    nextSelectionIds,
    selectionSource,
  );

  return (
    <article className="catalogCard">
      <div className="catalogCardHeader">
        <div>
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
        </div>
        {direction.programFocus ? (
          <span className="focusBadge">{direction.programFocus}</span>
        ) : null}
      </div>

      <p className="catalogDescription">{direction.shortDescription}</p>

      <dl className="catalogFacts">
        <div>
          <dt>Qualification</dt>
          <dd>{direction.context.qualification ?? "To be confirmed"}</dd>
        </div>
        <div>
          <dt>Level / form</dt>
          <dd>
            {direction.context.educationLevel ?? "Level pending"} /{" "}
            {direction.context.studyForm ?? "Form pending"}
          </dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{direction.context.studyDuration ?? "To be confirmed"}</dd>
        </div>
        <div>
          <dt>Seats</dt>
          <dd>
            Budget {direction.context.budgetSeats ?? "—"} / Paid{" "}
            {direction.context.paidSeats ?? "—"}
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

      <div className="catalogCardActions catalogCardActionsSplit">
        <Link
          className="secondaryActionLink"
          href={`/directions/${direction.slug}`}
        >
          Open direction page
        </Link>
        {isSelected ? (
          <Link className="secondaryActionLink" href={selectionHref}>
            Remove from compare
          </Link>
        ) : selectionIsFull ? (
          <span className="disabledAction">Selection full</span>
        ) : (
          <Link className="actionLink" href={selectionHref}>
            Add to compare
          </Link>
        )}
      </div>
    </article>
  );
}
