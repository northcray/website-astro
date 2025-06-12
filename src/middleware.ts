import type { MiddlewareHandler } from "astro";
import { getCurrentUser } from "./lib/auth";
import { loggedInPath } from "./constants.ts";

export const onRequest: MiddlewareHandler = async (
  { cookies, url, redirect, isPrerendered, locals },
  next,
) => {
  if (isPrerendered) return next();

  // Define protected route
  const protectedRoutes = [loggedInPath];
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const user = await getCurrentUser(cookies);

    if (!user) {
      return redirect("/account/signin", 302);
    }

    locals.user = user;

    if (!user.address) {
      return redirect("/account/update-address", 302);
    }
  }

  return next();
};
