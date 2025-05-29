import { createDirectus, rest } from "@directus/sdk";
import { INTERNAL_DIRECTUS_URL } from "astro:env/server";
import type { ApiCollections } from "./schema.ts";

export const initDirectus = () =>
  createDirectus<ApiCollections>(INTERNAL_DIRECTUS_URL).with(rest());

export default initDirectus();
