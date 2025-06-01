import type { APIRoute } from "astro";
import { logout } from "@lib/auth";

export const POST: APIRoute = async ({ cookies }) => {
  logout(cookies);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
