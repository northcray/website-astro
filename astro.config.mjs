// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.northcray.org",
  env: {
    schema: {
      DIRECTUS_API_URL: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
      BACKEND_ADMIN_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.bunny(),
        name: "Lato",
        cssVariable: "--font-lato",
      },
    ],
  },
});
