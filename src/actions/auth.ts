import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { verifyTurnstileToken } from "@lib/turnstile.ts";
import { createDirectusClient } from "@lib/directus";
import {
  type DirectusError,
  passwordRequest,
  passwordReset,
  registerUser,
} from "@directus/sdk";
import { logout, login, getCurrentUser, requestRemoval } from "@lib/auth.ts";

const directus = createDirectusClient();

export const auth = {
  passwordReset: defineAction({
    accept: "form",
    input: z
      .object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirm_password: z
          .string()
          .min(8, "Confirm password must be at least 8 characters"),
      })
      .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"], // path of error
      }),
    handler: async ({ token, password }, context) => {
      try {
        await directus.request(
          passwordReset(token as string, password as string),
        );
        return { success: true };
      } catch (e) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: (e as DirectusError).errors[0].message,
        });
      }
    },
  }),
  requestRemoval: defineAction({
    accept: "form",
    input: z.object({
      last_name: z.string().min(1, "Last name is required"),
      reason: z.string().min(12, "Reason must be at least 12 characters"),
    }),
    handler: async ({ last_name, reason }, { cookies }) => {
      // get the user from cookies
      const user = await getCurrentUser(cookies);

      // verify user is logged in
      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to delete your account.",
        });
      }

      // verify users challenge question answer
      if (user.last_name?.toLowerCase() !== last_name.toLowerCase()) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "Last name does not match our records.",
        });
      }

      // set user removal_requested to true (let directus handle the rest)
      try {
        await requestRemoval(cookies, reason);
        logout(cookies);

        return { success: true };
      } catch (e) {
        console.error("Error requesting account removal:", e);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to request account removal. Please try again later.",
        });
      }
    },
  }),
  sendPasswordResetEmail: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }, context) => {
      try {
        await directus.request(
          passwordRequest(
            email,
            new URL("/account/reset-password", context.site).toString(),
          ),
        );
        return { success: true };
      } catch (error) {
        // console.error("Error sending password reset email:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send password reset email",
        });
      }
    },
  }),
  signin: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      otp: z.string().length(6, "OTP must be 6 characters").optional(),
    }),
    handler: async ({ email, password, otp }, context) => {
      try {
        await login(context.cookies, email, password, otp);
        return { success: true };
      } catch (e) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: (e as Error).message,
        });
      }
    },
  }),
  logout: defineAction({
    accept: "form",
    handler: async (_, context) => {
      logout(context.cookies);
      return {};
    },
  }),
  registerUser: defineAction({
    accept: "form",
    input: z
      .object({
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirm_password: z
          .string()
          .min(8, "Confirm password must be at least 8 characters"),
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        "cf-turnstile-response": z.string(),
      })
      .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"], // path of error
      }),
    handler: async (input, ctx) => {
      const {
        email,
        password,
        first_name,
        last_name,
        "cf-turnstile-response": turnstileToken,
      } = input;

      console.log({
        ip: ctx.clientAddress,
        headers: Object.fromEntries(ctx.request.headers.entries()),
      });

      // Verify Turnstile token
      const isValidToken = await verifyTurnstileToken(
        turnstileToken,
        ctx.clientAddress,
      );

      if (!isValidToken) {
        throw new Error("Verification failed. Please try again.");
      }

      try {
        await directus.request(
          registerUser(email, password, {
            first_name,
            last_name,
            verification_url: new URL(
              "/account/email-verify",
              ctx.site,
            ).toString(),
          }),
        );
        return { success: true };
      } catch (e) {
        console.error("Error registering user:", e);
        return { success: false };
      }
    },
  }),
};
