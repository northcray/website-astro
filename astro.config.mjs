// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV ? "http://localhost:4321" : "https://northcray.org",

  security: {
    checkOrigin: false,
  },

  output: "server", // Changed from "static" to "server"
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
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
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
    // actions: true, // Removed as it's causing a config error
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
