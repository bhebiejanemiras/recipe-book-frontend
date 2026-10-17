import { useEffect, useState } from "react";
import { getRecipeService, type Recipe } from "@/services/recipe-service";
import RecipeMeta from "@/components/common/recipe-meta";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Alert } from "@/components/ui/alert";
import UpdateRecipeForm from "@/components/features/recipe/update-recipe-form";
import { resolveImageUrl } from "@/lib/image";

export function RecipeDetails({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(function fetchRecipe() {
    let active = true;

    async function loadRecipe() {
      try {
        const result = await getRecipeService(id);
        if (active) {
          setRecipe(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Recipe not found, or you do not have access to it.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipe();

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [id]);

  function openForm() {
    setStatus("");
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipe(updatedRecipe);
    setStatus("Recipe updated.");
    closeForm();
  }

  // Keep recipe content and its update dialog together in this feature.
  return (
    <>
      {loading && <p className="mt-6 text-sm text-ink/55">Loading recipe…</p>}

      {!loading && error && <Alert tone="error" className="mt-6">{error}</Alert>}

      {!loading && status && <Alert tone="success" className="mt-6">{status}</Alert>}

      {recipe && (
        <>
          {/* Keep image, metadata, and cooking steps grouped in one detail card. */}
          <Card className="mt-6">
            <div className="border-b border-ink/10 bg-paper">
              <img
                className="h-64 w-full object-cover sm:h-[420px]"
                src={resolveImageUrl(recipe.image)}
                alt={recipe.name}
                onError={(event) => {
                  const target = event.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='420'%3E%3Crect width='800' height='420' fill='%23f4f4f1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2316181c' font-size='16'%3ENo image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="space-y-8 p-6 sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="font-serif text-2xl tracking-tight sm:text-3xl">{recipe.name}</h1>
                <Button onClick={openForm}>Update</Button>
              </div>

              <RecipeMeta cuisine={recipe.cuisine} mealType={recipe.mealType} difficulty={recipe.difficulty} cookTimeMinutes={recipe.cookTimeMinutes} />

              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <section className="border border-ink/10 bg-paper p-6">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/50">Ingredients</h2>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-ink/75">
                    {recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}
                  </ul>
                </section>
                <section className="border border-ink/10 bg-paper p-6">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/50">Instructions</h2>
                  <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-ink/75">
                    {recipe.instructions.map((instruction, index) => <li key={`${instruction}-${index}`}>{instruction}</li>)}
                  </ol>
                </section>
              </div>
            </div>
          </Card>

          {/* The modal reuses the recipe form and updates this page after saving. */}
          <Modal open={open} onClose={closeForm} title="Update Recipe">
            <UpdateRecipeForm recipe={recipe} onSuccess={handleUpdated} />
          </Modal>
        </>
      )}
    </>
  );
}
