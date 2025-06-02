import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createDirectusClient } from "@lib/directus";
import { registerUser } from "@directus/sdk";
import { getUserByEmail, logout } from "@lib/auth.ts";
const directus = createDirectusClient();

export const server = {
  logout: defineAction({
    accept: "form",
    handler: async (_, context) => {
      logout(context.cookies);
      return {};
    },
  }),
  identifyUser: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      const userExists = await getUserByEmail(email);
      return { userExists, email };
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
      })
      .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"], // path of error
      }),
    handler: async (input, ctx) => {
      const { email, password, first_name, last_name } = input;

      try {
        await directus.request(
          registerUser(email, password, {
            first_name,
            last_name,
            verification_url: new URL(
              "/accounts/email-verify",
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
