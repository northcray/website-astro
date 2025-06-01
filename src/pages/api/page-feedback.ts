export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import { createDirectusClient } from "@lib/directus";
import { createItem } from "@directus/sdk";

const directus = createDirectusClient();

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const comment = data.get("comment") as string;

  const user_agent = request.headers.get("user-agent") || "";
  const page_url = request.headers.get("referer") || "";

  if (!comment || !user_agent || !page_url) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 },
    );
  }

  try {
    await directus.request(
      createItem("page_feedback", {
        comment,
        user_agent,
        page_url,
      }),
    );
  } catch (e) {
    console.error(e);
  }

  // tell the user 'thank you', even if something went wrong
  return new Response(
    JSON.stringify({
      message: "Thank you for your feedback!",
    }),
    { status: 200 },
  );
};
