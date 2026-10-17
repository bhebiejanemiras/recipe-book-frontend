import { useState, type SubmitEvent } from "react";
import { updateRecipeService, type Recipe } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

function linesToList(value: string) {
  return value.split("\n").filter((item) => item.trim() !== "");
}

export default function UpdateRecipeForm({ recipe, onSuccess }: { recipe: Recipe; onSuccess: (updated: Recipe) => void }) {
  const [name, setName] = useState(recipe.name);
  const [image, setImage] = useState(recipe.image);
  const [cuisine, setCuisine] = useState(recipe.cuisine);
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(String(recipe.cookTimeMinutes));
  const [mealType, setMealType] = useState(recipe.mealType.join("\n"));
  const [tags, setTags] = useState(recipe.tags.join("\n"));
  const [ingredients, setIngredients] = useState(recipe.ingredients.join("\n"));
  const [instructions, setInstructions] = useState(recipe.instructions.join("\n"));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Client-side checks mirror the API's Zod rules so the user gets a clear
  // message instead of a generic 400 response.
  function validate() {
    if (!name.trim()) return "Name is required.";
    if (!cuisine.trim()) return "Cuisine is required.";
    if (!/^https?:\/\/.+/i.test(image.trim())) return "Image must be a valid HTTP or HTTPS URL.";
    if (!Number.isInteger(Number(cookTimeMinutes)) || Number(cookTimeMinutes) < 0) return "Cook time must be a whole number of minutes (0 or more).";
    if (linesToList(mealType).length === 0) return "Enter at least one meal type.";
    if (linesToList(ingredients).length === 0) return "Enter at least one ingredient.";
    if (linesToList(instructions).length === 0) return "Enter at least one instruction.";
    return "";
  }

  const handleUpdateRecipe = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setError("");
    setBusy(true);
    try {
      const updatedRecipe = await updateRecipeService(recipe.id, {
        name,
        image,
        cuisine,
        difficulty,
        cookTimeMinutes: Number(cookTimeMinutes),
        mealType: linesToList(mealType),
        tags: linesToList(tags),
        ingredients: linesToList(ingredients),
        instructions: linesToList(instructions),
      });

      onSuccess(updatedRecipe);
    } catch (requestError) {
      setError(typeof requestError === "object" && requestError !== null && "response" in requestError
        ? ((requestError as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to update recipe.")
        : "Unable to connect to the API.");
    } finally {
      setBusy(false);
    }
  };

  // One column on phones, two on larger screens; separate row and column gaps.
  return (
    <form onSubmit={handleUpdateRecipe} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="update-recipe-name">Name</Label>
        <Input id="update-recipe-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="update-recipe-image">Image URL</Label>
        <Input id="update-recipe-image" type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
      </div>

      <div>
        <Label htmlFor="update-recipe-cuisine">Cuisine</Label>
        <Input id="update-recipe-cuisine" type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="update-recipe-difficulty">Difficulty</Label>
        <Select id="update-recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Recipe["difficulty"])}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="update-recipe-cook-time">Cook Time (minutes)</Label>
        <Input id="update-recipe-cook-time" type="number" min="0" step="1" value={cookTimeMinutes} onChange={(e) => setCookTimeMinutes(e.target.value)} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-meal-type">Meal Type (one per line)</Label>
        <Textarea id="update-recipe-meal-type" value={mealType} onChange={(e) => setMealType(e.target.value)} rows={3} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-tags">Tags (one per line)</Label>
        <Textarea id="update-recipe-tags" value={tags} onChange={(e) => setTags(e.target.value)} rows={3} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-ingredients">Ingredients (one per line)</Label>
        <Textarea id="update-recipe-ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={4} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="update-recipe-instructions">Instructions (one per line)</Label>
        <Textarea id="update-recipe-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} />
      </div>

      {error && <p role="alert" className="text-sm text-danger sm:col-span-2">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full sm:col-span-2">
        {busy ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
