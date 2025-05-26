import { PUBLIC_DIRECTUS_URL } from "astro:env/client";

export const getImageSrc = (image: string, imageKey?: string): string => {
  const search = imageKey ? `?key=${imageKey}` : "";
  return `${PUBLIC_DIRECTUS_URL}/assets/${image}${search}`;
};
