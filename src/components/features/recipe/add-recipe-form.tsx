import { useState, type SubmitEvent } from "react";
import { createRecipeService, uploadRecipeImageService, type Recipe } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImagePicker } from "@/components/common/image-picker";

type AddRecipeFormProps = {
  onSuccess: (newRecipe: Recipe) => void;
};

type FormErrors = {
  name?: string;
  image?: string;
  cuisine?: string;
  difficulty?: string;
  cookTimeMinutes?: string;
  mealType?: string;
  tags?: string;
  ingredients?: string;
  instructions?: string;
};

const messages: FormErrors = {
  name: "Name is required",
  image: "Add a photo for your recipe",
  cuisine: "Cuisine is required",
  difficulty: "Difficulty is required",
  cookTimeMinutes: "Cook time is required",
  mealType: "Meal type is required",
  tags: "Tags are required",
  ingredients: "Ingredients are required",
  instructions: "Instructions are required",
};

export default function AddRecipeForm({ onSuccess }: AddRecipeFormProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [mealType, setMealType] = useState("");
  const [tags, setTags] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  // show error if empty, remove error if has value
  const checkField = (field: keyof FormErrors, value: string) => {
    setErrors({
      ...errors,
      [field]: value.trim() === "" ? messages[field] : undefined,
    });
  };

  // Keep a lightweight preview for the chosen file and clear the previous one.
  const handleSelectImage = (selected: File | null) => {
    setFile(selected);
    setErrors({ ...errors, image: selected ? undefined : messages.image });
    setPreview((current) => {
      if (current && current.startsWith("blob:")) URL.revokeObjectURL(current);
      return selected ? URL.createObjectURL(selected) : null;
    });
  };

  const handleAddRecipe = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const values: Record<string, string> = { name, cuisine, difficulty, cookTimeMinutes, mealType, tags, ingredients, instructions };

    const newErrors: FormErrors = {};
    let hasError = false;

    // check each required field
    for (const field in values) {
      const key = field as keyof FormErrors;
      const value = values[field];

      if (typeof value === "string" && value.trim() === "") {
        newErrors[key] = messages[key];
        hasError = true;
      }
    }

    // The photo is uploaded when the form is submitted, so it is checked separately.
    if (!file) {
      newErrors.image = messages.image;
      hasError = true;
    }

    // Client-side checks mirror the API's Zod rules so the user gets a clear
    // message instead of a generic 400 response.
    if (!hasError && (!Number.isInteger(Number(cookTimeMinutes)) || Number(cookTimeMinutes) < 0)) {
      newErrors.cookTimeMinutes = "Enter a whole number of minutes (0 or more)";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError || !file) {
      return;
    }

    setBusy(true);
    try {
      // Upload first, then create the recipe with the returned image path.
      const image = await uploadRecipeImageService(file);

      const newRecipe = await createRecipeService({
        name,
        image,
        cuisine,
        difficulty,
        cookTimeMinutes: Number(cookTimeMinutes),
        mealType: mealType.split("\n").filter((item) => item.trim() !== ""),
        tags: tags.split("\n").filter((item) => item.trim() !== ""),
        ingredients: ingredients.split("\n").filter((item) => item.trim() !== ""),
        instructions: instructions.split("\n").filter((item) => item.trim() !== ""),
      });

      onSuccess(newRecipe);
    } catch (error) {
      setSubmitError(typeof error === "object" && error !== null && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to create recipe.")
        : "Unable to connect to the API.");
    } finally {
      setBusy(false);
    }
  };

  // One column on phones, two on larger screens; separate row and column gaps.
  return (
    <form onSubmit={handleAddRecipe} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <ImagePicker preview={preview} error={errors.image} onSelect={handleSelectImage} />
      </div>

      <div>
        <Label htmlFor="recipe-name" error={errors.name}>Name</Label>
        <Input id="recipe-name" type="text" value={name} onChange={(e) => { setName(e.target.value); checkField("name", e.target.value); }} onBlur={() => checkField("name", name)} error={errors.name} />
      </div>

      <div>
        <Label htmlFor="recipe-cuisine" error={errors.cuisine}>Cuisine</Label>
        <Input id="recipe-cuisine" type="text" value={cuisine} onChange={(e) => { setCuisine(e.target.value); checkField("cuisine", e.target.value); }} onBlur={() => checkField("cuisine", cuisine)} error={errors.cuisine} />
      </div>

      <div>
        <Label htmlFor="recipe-difficulty" error={errors.difficulty}>Difficulty</Label>
        <Select id="recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipe-cook-time" error={errors.cookTimeMinutes}>Cook Time (minutes)</Label>
        <Input id="recipe-cook-time" type="number" min="0" value={cookTimeMinutes} onChange={(e) => { setCookTimeMinutes(e.target.value); checkField("cookTimeMinutes", e.target.value); }} onBlur={() => checkField("cookTimeMinutes", cookTimeMinutes)} error={errors.cookTimeMinutes} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-meal-type" error={errors.mealType}>Meal Type (one per line)</Label>
        <Textarea
          id="recipe-meal-type" value={mealType} onChange={(e) => { setMealType(e.target.value); checkField("mealType", e.target.value); }} onBlur={() => checkField("mealType", mealType)} rows={3} placeholder={"Breakfast\nLunch\nDinner"} error={errors.mealType} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-tags" error={errors.tags}>Tags (one per line)</Label>
        <Textarea
          id="recipe-tags" value={tags} onChange={(e) => { setTags(e.target.value); checkField("tags", e.target.value); }} onBlur={() => checkField("tags", tags)} rows={3} placeholder={"Italian\nPizza"} error={errors.tags} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-ingredients" error={errors.ingredients}>Ingredients (one per line)</Label>
        <Textarea
          id="recipe-ingredients" value={ingredients} onChange={(e) => { setIngredients(e.target.value); checkField("ingredients", e.target.value); }} onBlur={() => checkField("ingredients", ingredients)} rows={3} error={errors.ingredients} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-instructions" error={errors.instructions}>Instructions (one per line)</Label>
        <Textarea
          id="recipe-instructions" value={instructions} onChange={(e) => { setInstructions(e.target.value); checkField("instructions", e.target.value); }} onBlur={() => checkField("instructions", instructions)} rows={3} error={errors.instructions} />
      </div>

      {submitError && <p role="alert" className="text-sm text-danger sm:col-span-2">{submitError}</p>}
      <Button type="submit" disabled={busy} className="w-full sm:col-span-2 disabled:cursor-wait disabled:opacity-60">
        {busy ? "Uploading…" : "Add Recipe"}
      </Button>
    </form>
  );
}
