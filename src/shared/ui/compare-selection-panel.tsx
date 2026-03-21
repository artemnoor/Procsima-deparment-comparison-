import Link from "next/link";

import {
  buildComparisonHref,
  buildComparisonSelectionPath,
  minimumComparisonDirectionCount,
  type ComparisonEntrySource,
} from "@/modules/comparison";

type CompareSelectionPanelProps = {
  pathname: string;
  source: ComparisonEntrySource;
  selectedDirectionIds: string[];
  selectedDirections: Array<{
    id: string;
    title: string;
  }>;
};

export function CompareSelectionPanel(props: CompareSelectionPanelProps) {
  const { pathname, source, selectedDirectionIds, selectedDirections } = props;
  const comparisonIsReady =
    selectedDirectionIds.length >= minimumComparisonDirectionCount;

  return (
    <section className="card compareSelectionPanel">
      <div className="compareSelectionHeader">
        <div>
          <div className="sectionEyebrow">Выбор для сравнения</div>
          <h3 className="cardTitle">
            Выбрано направлений: {selectedDirectionIds.length}
          </h3>
          <p className="muted">
            Выберите от 2 до 4 направлений, затем откройте страницу сравнения.
          </p>
        </div>
        <div className="compareSelectionActions">
          <Link
            className="secondaryActionLink"
            href={buildComparisonSelectionPath(pathname, [], source)}
          >
            Очистить выбор
          </Link>
          {comparisonIsReady ? (
            <Link
              className="actionLink"
              href={buildComparisonHref(selectedDirectionIds, source)}
            >
              Открыть сравнение
            </Link>
          ) : null}
        </div>
      </div>

      <div className="compareSelectionList">
        {selectedDirections.map((direction) => (
          <span className="chip chipMuted" key={direction.id}>
            {direction.title}
          </span>
        ))}
      </div>
    </section>
  );
}
