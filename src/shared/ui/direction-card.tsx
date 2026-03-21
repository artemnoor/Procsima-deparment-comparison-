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
              {direction.context.code ?? "Код уточняется"}
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
          <dt>Квалификация</dt>
          <dd>{direction.context.qualification ?? "Будет уточнено"}</dd>
        </div>
        <div>
          <dt>Уровень / форма</dt>
          <dd>
            {direction.context.educationLevel ?? "Уровень уточняется"} /{" "}
            {direction.context.studyForm ?? "Форма уточняется"}
          </dd>
        </div>
        <div>
          <dt>Срок обучения</dt>
          <dd>{direction.context.studyDuration ?? "Будет уточнено"}</dd>
        </div>
        <div>
          <dt>Места</dt>
          <dd>
            Бюджет {direction.context.budgetSeats ?? "—"} / Платно{" "}
            {direction.context.paidSeats ?? "—"}
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

      <div className="catalogCardActions catalogCardActionsSplit">
        <Link
          className="secondaryActionLink"
          href={`/directions/${direction.slug}`}
        >
          Открыть страницу направления
        </Link>
        {isSelected ? (
          <Link className="secondaryActionLink" href={selectionHref}>
            Убрать из сравнения
          </Link>
        ) : selectionIsFull ? (
          <span className="disabledAction">Лимит выбора достигнут</span>
        ) : (
          <Link className="actionLink" href={selectionHref}>
            Добавить к сравнению
          </Link>
        )}
      </div>
    </article>
  );
}
