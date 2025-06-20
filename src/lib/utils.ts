import { PUBLIC_DIRECTUS_URL } from "astro:env/client";

export const getImageSrc = (image: string, imageKey?: string): string => {
  const search = imageKey ? `?key=${imageKey}` : "";
  return `${PUBLIC_DIRECTUS_URL}/assets/${image}${search}`;
};

export const formatArchivePosts = (posts) =>
  posts
    .sort((a, b) => {
      return Number(a.id.replace(/\D/g, "")) - Number(b.id.replace(/\D/g, ""));
    })
    .map((post) => {
      const body = post.body?.split("\n");

      if (!body) {
        console.log(`Post ${post.id} has no body.`);
      }

      let date = "Unknown";

      if (!Number.isNaN(body[0][0])) {
        date = body[0];
      }

      const dateFormatted = new Date(date);
      const year = dateFormatted.getFullYear();

      return {
        key: post.id,
        date,
        year,
        label: post.id.toUpperCase(),
        href: `/ra/archive/emails/item/${post.id}`,
        post,
      };
    });
