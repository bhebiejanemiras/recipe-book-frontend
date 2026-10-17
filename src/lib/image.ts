// The API stores uploaded photos as a relative path (for example
// "/api/recipes/v1/image/<uuid>") so a recipe stays valid in every environment
// that shares the database. External URLs are returned untouched.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

function apiOrigin() {
  if (!apiBaseUrl) return "";
  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "";
  }
}

export function resolveImageUrl(image: string) {
  if (!image) return "";
  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:") || image.startsWith("blob:")) return image;
  const origin = apiOrigin();
  return `${origin}${image.startsWith("/") ? image : `/${image}`}`;
}
