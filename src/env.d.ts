import type { DirectusUser } from "@lib/directus/schema.ts";

type User = Pick<
  DirectusUser,
  | "id"
  | "email"
  | "first_name"
  | "last_name"
  | "address"
  | "telephone"
  | "role"
  | "stripe_customer_id"
>;

declare namespace App {
  interface Locals {
    user?: User;
  }
}
