import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { verifyTurnstileToken } from "@lib/turnstile.ts";
import { createDirectusClient } from "@lib/directus";
import { passwordRequest, registerUser } from "@directus/sdk";
import { logout, login } from "@lib/auth.ts";
import { loggedInPath } from "../constants.ts";
const directus = createDirectusClient();

export const auth = {
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
        console.error("Error sending password reset email:", error);
        return { success: false, error: "Failed to send password reset email" };
      }
    },
  }),
  signin: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters"),
    }),
    handler: async ({ email, password }, context) => {
      const user = await login(context.cookies, email, password);
      if (!user) {
        throw new Error("Incorrect password or no account with that email");
      }
      return { success: true, redirect: loggedInPath };
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

      console.log(`IP: ${ctx.clientAddress}`);

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
