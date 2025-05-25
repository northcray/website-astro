import { createDirectus, rest } from "@directus/sdk";
import type { ApiCollections } from "./schema.ts";

export const initDirectus = () =>
  createDirectus<ApiCollections>(import.meta.env.PUBLIC_DIRECTUS_URL).with(
    rest(),
  );

export default initDirectus();
