import type { MiddlewareHandler } from "astro";
import { getCurrentUser } from "./lib/auth";
import { loggedInPath } from "./constants.ts";

export const onRequest: MiddlewareHandler = async (
  { cookies, url, redirect },
  next,
) => {
  // Define protected routes
  const protectedRoutes = [loggedInPath];
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const user = await getCurrentUser(cookies);

    if (!user) {
      return redirect("/account/signin");
    }
  }

  return next();
};
