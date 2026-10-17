type RecipeMetaProps = {
  cuisine: string;
  mealType: string[];
  difficulty: string;
  cookTimeMinutes: number;
};

// A hairline grid keeps the facts boxed and easy to scan.
export default function RecipeMeta({ cuisine, mealType, difficulty, cookTimeMinutes }: RecipeMetaProps) {
  const items = [
    { label: "Cuisine", value: cuisine },
    { label: "Meal type", value: mealType.join(", ") },
    { label: "Difficulty", value: difficulty },
    { label: "Cook time", value: `${cookTimeMinutes} mins` },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
