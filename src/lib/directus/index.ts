import type { DirectusSchema } from "./schema.ts";
import {
  createDirectus,
  rest,
  authentication,
  staticToken,
  readMe,
  refresh,
  type AuthenticationData,
  type DirectusClient,
  type RestClient,
  type DirectusError,
} from "@directus/sdk";
import {
  INTERNAL_DIRECTUS_URL,
  CLOUDFLARE_SERVICE_TOKEN_ID,
  CLOUDFLARE_SERVICE_TOKEN_SECRET,
} from "astro:env/server";
import type { AuthResult, AuthTokens } from "@lib/directus/types.ts";

// Create base Directus client
export function createDirectusClient(): DirectusClient<DirectusSchema> &
  RestClient<DirectusSchema> {
  return createDirectus<DirectusSchema>(INTERNAL_DIRECTUS_URL).with(
    rest({
      onRequest: (options) => {
        options.headers = {
          ...options.headers,
          "CF-Access-Client-Id": CLOUDFLARE_SERVICE_TOKEN_ID,
          "CF-Access-Client-Secret": CLOUDFLARE_SERVICE_TOKEN_SECRET,
        };
        return options;
      },
    }),
  );
}

// Create authenticated Directus client
export function createAuthenticatedDirectusClient(
  token: string,
): DirectusClient<DirectusSchema> & RestClient<DirectusSchema> {
  return createDirectus<DirectusSchema>(INTERNAL_DIRECTUS_URL)
    .with(
      rest({
        onRequest: (options) => {
          options.headers = {
            ...options.headers,
            "CF-Access-Client-Id": CLOUDFLARE_SERVICE_TOKEN_ID,
            "CF-Access-Client-Secret": CLOUDFLARE_SERVICE_TOKEN_SECRET,
          };
          return options;
        },
      }),
    )
    .with(staticToken(token));
}

// Login function
export async function loginWithDirectus(
  email: string,
  password: string,
  otp?: string,
): Promise<AuthResult> {
  try {
    const directus = createDirectusClient().with(authentication("json"));

    const authData: AuthenticationData = await directus.login(
      email,
      password,
      otp ? { otp } : undefined,
    );

    if (authData.access_token && authData.refresh_token) {
      // Get user data using proper SDK method
      const authenticatedClient = createAuthenticatedDirectusClient(
        authData.access_token,
      );
      const user = await authenticatedClient.request(
        readMe({
          fields: ["id", "first_name", "last_name", "email", "role", "avatar"],
        }),
      );

      return {
        user,
        tokens: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          expires: authData.expires ?? Date.now() + 60 * 60 * 1000, // 1-hour default
        },
      };
    }

    return { user: null, tokens: null, otpError: false };
  } catch (error) {
    const directusError = error as DirectusError;
    const otpError = directusError.errors[0].extensions.code === "INVALID_OTP";
    return { user: null, tokens: null, otpError };
  }
}

// Refresh token function
export async function refreshDirectusToken(
  refreshToken: string,
): Promise<AuthTokens | null> {
  try {
    const directus = createDirectusClient().with(authentication("json"));

    // Set the refresh token first
    await directus.setToken(refreshToken);

    // Use the refresh command properly
    const authData: AuthenticationData = await directus.request(
      refresh("json", refreshToken),
    );

    if (authData.access_token) {
      return {
        access_token: authData.access_token,
        refresh_token: authData.refresh_token || refreshToken,
        expires: authData.expires ?? Date.now() + 60 * 60 * 1000,
      };
    }

    return null;
  } catch (error) {
    // console.error("Token refresh failed:", error);
    return null;
  }
}

// Get current user
export async function getCurrentDirectusUser(token: string) {
  try {
    const directus = createAuthenticatedDirectusClient(token);

    // Use proper SDK method for getting current user
    const res = await directus.request(
      readMe({
        fields: [
          "id",
          "first_name",
          "last_name",
          "email",
          "telephone",
          "address.full_address",
          "address.street",
          "stripe_customer_id",
          "mailerlite_subscriber_id",
          "subscription_active",
        ],
      }),
    );

    console.log(JSON.stringify(Object.keys(res)));

    if (!res.email) {
      // console.warn("No email found for current user, returning null.");
      return null;
    }

    return res;
  } catch (error) {
    // console.error("Failed to get current user:", error);
    return null;
  }
}
