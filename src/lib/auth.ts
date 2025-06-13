import type { AstroCookies } from "astro";
import type { AuthTokens } from "./directus/types";
import {
  loginWithDirectus,
  refreshDirectusToken,
  getCurrentDirectusUser,
  createAuthenticatedDirectusClient,
} from "./directus";
import { updateMe } from "@directus/sdk";

export const TOKEN_COOKIE = "directus_token";
export const REFRESH_TOKEN_COOKIE = "directus_refresh_token";

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
    maxAge: 60 * 60 * 24, // 1 day
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
  otp?: string,
) {
  const result = await loginWithDirectus(email, password, otp);

  if (result.tokens && result.user) {
    setAuthCookies(cookies, result.tokens);
    return result.user;
  }

  if (result.otpError) {
    throw new Error("BAD_OTP");
  }

  throw new Error("BAD_CREDS");
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

export const requestRemoval = async (cookies: AstroCookies, reason: string) =>
  makeAuthenticatedRequest(cookies, async (client) =>
    client.request(
      updateMe({
        removal_requested: true,
        removal_reason: reason,
      }),
    ),
  );
