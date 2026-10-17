import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import RecipeMeta from "@/components/common/recipe-meta";

type RecipeCardProps = {
  id: string;
  image: string;
  name: string;
  cuisine: string;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  tags: string[];
  onDelete: (id: string) => void;
};

export default function RecipeCard({ id, image, name, cuisine, mealType, difficulty, cookTimeMinutes, tags, onDelete }: RecipeCardProps) {
  return (
    <Card className="flex h-full flex-col transition-colors hover:border-ink/30">
      <div className="h-52 overflow-hidden border-b border-ink/10 bg-paper">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-serif text-xl leading-snug tracking-tight text-ink">{name}</h3>

        <RecipeMeta cuisine={cuisine} mealType={mealType} difficulty={difficulty} cookTimeMinutes={cookTimeMinutes} />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-ink/10 pt-4">
          <Link to={`/recipe/${id}`}>
            <Button className="w-full">View</Button>
          </Link>
          <Button variant="danger" className="w-full" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
