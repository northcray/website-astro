import type { MiddlewareHandler } from "astro";
import { getCurrentUser } from "./lib/auth";

export const onRequest: MiddlewareHandler = async (
  { cookies, url, redirect },
  next,
) => {
  // Define protected routes
  const protectedRoutes = ["/account/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const user = await getCurrentUser(cookies);

    if (!user) {
      return redirect("/login");
    }
  }

  return next();
};
