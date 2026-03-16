type FactGridItem = {
  label: string;
  value: string;
};

type FactGridProps = {
  items: FactGridItem[];
};

export function FactGrid(props: FactGridProps) {
  return (
    <dl className="catalogFacts">
      {props.items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
