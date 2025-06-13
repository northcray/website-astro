import { STRIPE_SECRET_KEY } from "astro:env/server";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Stripe } from "stripe";
import { getCurrentUser } from "@lib/auth.ts";

let stripe: Stripe;

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

export const stripeActions = {
  createCheckoutSession: defineAction({
    accept: "json",
    input: z.object({
      lookup_key: z.string(),
    }),
    handler: async ({ lookup_key }, { site, cookies }) => {
      const user = await getCurrentUser(cookies);

      if (!user || !user.stripe_customer_id) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "User not authenticated or Stripe customer ID not found.",
        });
      }

      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key.toString()],
        expand: ["data.product"],
      });

      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        client_reference_id: user.id,
        customer: user.stripe_customer_id,
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: new URL("/return", site).toString(),
        cancel_url: new URL("/return", site).toString(),
      });

      if (session) {
        console.info({ session });
        return { url: session.url.toString() };
      } else {
        return { url: null };
      }
    },
  }),
  createPortalSession: defineAction({
    handler: async (_, { site, cookies }) => {
      const user = await getCurrentUser(cookies);

      if (!user || !user.stripe_customer_id) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "User not authenticated or Stripe customer ID not found.",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: new URL("/return", site).toString(),
      });

      if (session) {
        return { url: session.url };
      }

      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Could not create Stripe billing portal session.",
      });
    },
  }),
};
