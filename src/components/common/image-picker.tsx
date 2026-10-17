import { useId, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";

type ImagePickerProps = {
  preview: string | null;
  error?: string;
  onSelect: (file: File | null) => void;
};

// File-upload control that replaces the old image-link field. The selected file
// is uploaded when the surrounding form is submitted.
export function ImagePicker({ preview, error, onSelect }: ImagePickerProps) {
  const inputId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onSelect(event.target.files?.[0] ?? null);
    // Reset so choosing the same file again still fires the change event.
    event.target.value = "";
  }

  return (
    <div>
      <span className={cn("mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em]", error ? "text-danger" : "text-ink/55")}>
        Recipe photo
      </span>

      <div className={cn("flex flex-col gap-3 border bg-white p-3 sm:flex-row sm:items-center", error ? "border-danger" : "border-ink/15")}>
        <div className="h-28 w-full shrink-0 overflow-hidden border border-ink/10 bg-paper sm:w-40">
          {preview ? (
            <img src={preview} alt="Selected recipe" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink/40">No photo selected</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center justify-center gap-2 border border-ink/20 bg-white px-4 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-ink hover:bg-paper focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
          >
            {preview ? "Change photo" : "Choose photo"}
            <input id={inputId} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={handleChange} />
          </label>

          {preview && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="inline-flex cursor-pointer items-center justify-center border border-transparent px-4 py-2.5 text-sm font-medium tracking-wide text-ink/60 transition-colors hover:text-ink"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-xs text-ink/45">PNG, JPG, WEBP or GIF, up to 5 MB.</p>
      {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
