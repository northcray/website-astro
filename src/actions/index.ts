import { auth } from "./auth";
import { profile } from "./profile";
import { stripeActions as stripe } from "./stripe";

export const server = {
  auth,
  profile,
  stripe,
};
