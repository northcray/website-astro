// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.northcray.org",

  output: "static",
  adapter: node({
    mode: "standalone",
  }),

  env: {
    validateSecrets: true,
    schema: {
      PUBLIC_DIRECTUS_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
      }),
      INTERNAL_DIRECTUS_URL: envField.string({
        context: "server",
        access: "secret",
        url: true,
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

  integrations: [sitemap(), react()],
});
