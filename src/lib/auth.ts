import type { AstroCookies } from "astro";
import { DIRECTUS_ADMIN_TOKEN } from "astro:env/server";
import type { AuthTokens } from "./directus/types";
import type { DirectusUser } from "./directus/schema";
import {
  loginWithDirectus,
  refreshDirectusToken,
  getCurrentDirectusUser,
  createAuthenticatedDirectusClient,
} from "./directus";
import { readUsers } from "@directus/sdk";

const TOKEN_COOKIE = "directus_token";
const REFRESH_TOKEN_COOKIE = "directus_refresh_token";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
};

// Set auth cookies
export function setAuthCookies(
  cookies: AstroCookies,
  tokens: AuthTokens,
): void {
  cookies.set(TOKEN_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: 60 * 60, // 1 hour
  });

  cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Clear auth cookies
export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete(TOKEN_COOKIE);
  cookies.delete(REFRESH_TOKEN_COOKIE);
}

// Get tokens from cookies
export function getTokensFromCookies(cookies: AstroCookies): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  return {
    accessToken: cookies.get(TOKEN_COOKIE)?.value || null,
    refreshToken: cookies.get(REFRESH_TOKEN_COOKIE)?.value || null,
  };
}

// Login user
export async function login(
  cookies: AstroCookies,
  email: string,
  password: string,
): Promise<DirectusUser | null> {
  const result = await loginWithDirectus(email, password);

  if (result.tokens && result.user) {
    setAuthCookies(cookies, result.tokens);
    return result.user;
  }

  return null;
}

// Logout user
export function logout(cookies: AstroCookies): void {
  clearAuthCookies(cookies);
}

// Get current user with auto-refresh
export async function getCurrentUser(cookies: AstroCookies) {
  const { accessToken, refreshToken } = getTokensFromCookies(cookies);

  if (!accessToken && !refreshToken) {
    return null;
  }

  // Try with current access token first
  if (accessToken) {
    const user = await getCurrentDirectusUser(accessToken);
    if (user) {
      return user;
    }
  }

  // Access token failed or missing, try refresh
  if (refreshToken) {
    const newTokens = await refreshDirectusToken(refreshToken);
    if (newTokens) {
      setAuthCookies(cookies, newTokens);
      return await getCurrentDirectusUser(newTokens.access_token);
    }
  }

  // Both failed, clear cookies
  clearAuthCookies(cookies);
  return null;
}

// Check if user is authenticated
export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const user = await getCurrentUser(cookies);
  return user !== null;
}

// Make authenticated request with auto-refresh
export async function makeAuthenticatedRequest<T>(
  cookies: AstroCookies,
  requestFn: (
    client: ReturnType<typeof createAuthenticatedDirectusClient>,
  ) => Promise<T>,
): Promise<T> {
  const { accessToken, refreshToken } = getTokensFromCookies(cookies);

  if (!accessToken && !refreshToken) {
    throw new Error("No authentication tokens available");
  }

  // Try with current access token
  if (accessToken) {
    try {
      const client = createAuthenticatedDirectusClient(accessToken);
      return await requestFn(client);
    } catch (error: any) {
      // If not a 401 error, throw it
      if (error.status !== 401) {
        throw error;
      }
    }
  }

  // Access token failed or missing, try refresh
  if (refreshToken) {
    const newTokens = await refreshDirectusToken(refreshToken);
    if (newTokens) {
      setAuthCookies(cookies, newTokens);
      const client = createAuthenticatedDirectusClient(newTokens.access_token);
      return await requestFn(client);
    }
  }

  // Both failed, clear cookies and throw
  clearAuthCookies(cookies);
  throw new Error("Authentication failed");
}

export const getUserByEmail = async (email: string) => {
  const client = createAuthenticatedDirectusClient(DIRECTUS_ADMIN_TOKEN);
  const res = await client.request(
    readUsers({
      fields: ["id"],
      filter: { email: { _eq: email } },
      limit: 1,
    }),
  );
  return res.length > 0;
};
