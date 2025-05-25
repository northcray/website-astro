import { createDirectus, rest } from "@directus/sdk";
import { DIRECTUS_API_URL } from "astro:env/client";
import type { ApiCollections } from "./schema.ts";

export const initDirectus = () =>
  createDirectus<ApiCollections>(DIRECTUS_API_URL).with(rest());

export default initDirectus();
