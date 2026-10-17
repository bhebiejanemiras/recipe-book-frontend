import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { resolveImageUrl } from "@/lib/image";

export type AdminRecipe = {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  mealType: string[];
  difficulty: string;
  cookTimeMinutes: number;
  userId: string;
  ownerName: string | null;
};

type AdminRecipesTableProps = {
  recipes: AdminRecipe[];
  loading: boolean;
};

// Display only: fetching data and handling errors belongs to AdminRecipes.
export function AdminRecipesTable({ recipes, loading }: AdminRecipesTableProps) {
  return (
    <Table>
      <caption className="sr-only">Recipes from all users</caption>
      <thead>
        <tr>
          <th scope="col">Recipe</th>
          <th scope="col">Cuisine</th>
          <th scope="col">Meal type</th>
          <th scope="col">Difficulty</th>
          <th scope="col">Cook time</th>
          <th scope="col">Owner ID</th>
          <th scope="col">Owner name</th>
        </tr>
      </thead>
      <tbody>
        {!loading && recipes.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center text-ink/55">No recipes have been created yet.</td>
          </tr>
        )}
        {recipes.map(function renderRecipe(recipe) {
          return (
            <tr key={recipe.id}>
              <td>
                <div className="flex min-w-48 items-center gap-3">
                  <img
                    src={resolveImageUrl(recipe.image)}
                    alt=""
                    className="h-12 w-12 border border-ink/10 object-cover"
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.onerror = null;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f4f4f1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2316181c' font-size='8'%3ENo img%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <span className="font-medium">{recipe.name}</span>
                </div>
              </td>
              <td>{recipe.cuisine}</td>
              <td>{recipe.mealType.join(", ")}</td>
              <td><Tag>{recipe.difficulty}</Tag></td>
              <td>{recipe.cookTimeMinutes} mins</td>
              <td className="font-mono text-xs text-ink/50">{recipe.userId}</td>
              <td>{recipe.ownerName || "Unnamed user"}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
