import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createDirectusClient } from "@lib/directus";
import { type DirectusError, readItems, updateMe } from "@directus/sdk";
import { getCurrentUser, makeAuthenticatedRequest } from "@lib/auth.ts";

const directus = createDirectusClient();

export const profile = {
  updateAddress: defineAction({
    accept: "form",
    input: z.object({
      address: z.string().min(1, "Address is required"),
    }),
    handler: async ({ address }, { cookies }) => {
      try {
        await makeAuthenticatedRequest(cookies, (client) =>
          client.request(updateMe({ address })),
        );

        return { success: true };
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as DirectusError).errors[0].message,
        });
      }
    },
  }),
  lookupPostcode: defineAction({
    accept: "form",
    input: z.object({
      postcode: z.string().min(7, "Postcode must be at least 7 characters"),
    }),
    handler: async ({ postcode }, { cookies }) => {
      const user = await getCurrentUser(cookies);

      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const response = await directus.request(
          readItems("addresses", {
            fields: ["uprn", "full_address"],
            sort: ["uprn"],
            filter: {
              status: { _eq: "published" },
              postcode: {
                _contains: postcode.toUpperCase(),
              },
            },
            limit: -1,
          }),
        );
        return { addresses: response || [] };
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as DirectusError).errors[0].message,
        });
      }
    },
  }),
};
