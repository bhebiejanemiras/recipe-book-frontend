import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { deleteRecipeService, getRecipesService, type Recipe } from "@/services/recipe-service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import RecipeCard from "@/components/features/recipe/recipe-card";
import AddRecipeForm from "@/components/features/recipe/add-recipe-form";

export function RecipeCollection() {
  const { user, ready } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(function fetchRecipes() {
    if (!ready || !user) {
      return;
    }

    let active = true;

    async function loadRecipes() {
      try {
        const result = await getRecipesService();
        if (active) {
          setRecipes(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Unable to load recipes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    // Ignore a response if the account changes or this feature is removed.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [ready, user]);

  async function handleDelete(id: string) {
    if (!confirm("Do you want to delete this recipe?")) return;
    setError("");
    setStatus("");
    try {
      await deleteRecipeService(id);
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
      setStatus("Recipe deleted.");
    } catch {
      setError("Unable to delete this recipe. Please try again.");
    }
  }

  if (!ready) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  function openForm() {
    setStatus("");
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleCreated(newRecipe: Recipe) {
    setRecipes(function addRecipe(currentRecipes) {
      return [newRecipe, ...currentRecipes];
    });
    setStatus(`"${newRecipe.name}" was added to your recipes.`);
    closeForm();
  }

  // The page supplies the header; this feature owns the collection and its dialog.
  return (
    <>
      {/* Collection heading and primary action wrap on narrow screens. */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-5">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Your recipes</h2>
          <p className="mt-1 text-sm text-ink/55">
            {loading
              ? "Loading your recipes…"
              : `${recipes.length} saved ${recipes.length === 1 ? "recipe" : "recipes"} to inspire your next meal`}
          </p>
        </div>
        <Button onClick={openForm}>Add recipe</Button>
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {status && <Alert tone="success" className="mb-4">{status}</Alert>}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="animate-pulse border border-ink/10 bg-white">
              <div className="h-52 border-b border-ink/10 bg-paper" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 bg-paper" />
                <div className="h-4 w-1/2 bg-paper" />
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
          <h3 className="font-serif text-xl">A fresh page for your favourites</h3>
          <p className="mt-2 text-sm text-ink/55">Save a family classic or something new you want to try.</p>
          <Button className="mt-6" onClick={openForm}>Add your first recipe</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} onDelete={handleDelete} />)}
        </div>
      )}

      {/* Add the saved recipe to local state so the list updates immediately. */}
      <Modal open={open} onClose={closeForm} title="Add Recipe">
        <AddRecipeForm onSuccess={handleCreated} />
      </Modal>
    </>
  );
}
