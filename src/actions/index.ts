import { defineAction } from "astro:actions";
// import { DIRECTUS_ADMIN_TOKEN } from "astro:env/server";
import { z } from "astro:schema";
import { createDirectusClient } from "@lib/directus";
import { registerUser } from "@directus/sdk";
const directus = createDirectusClient();

export const server = {
  identifyUser: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      // const user = await getUserByEmail(email); // We'll need to implement this
      // For now, let's assume a placeholder logic
      const userExists = false;

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
            verification_url: `${ctx.url.origin}/accounts/email-verify`,
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
