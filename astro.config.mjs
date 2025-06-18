// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { robotsDisallowPaths } from "./src/const.js"; // do not shorten

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

  redirects: {
    "/association": "/ra/about",
  },

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
      CLOUDFLARE_SERVICE_TOKEN_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      CLOUDFLARE_SERVICE_TOKEN_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      STRIPE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
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
        weights: [300, 400, 700],
        fallbacks: ["Lucida Sans Unicode", "Tahoma"],
        subsets: ["latin"],
        cssVariable: "--font-lato",
      },
      {
        provider: fontProviders.fontshare(),
        name: "Erode",
        weights: [300, 400, 700],
        fallbacks: ["Lucida Sans Unicode", "Tahoma"],
        subsets: ["latin"],
        cssVariable: "--font-erode",
      },
    ],
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        return !robotsDisallowPaths.some((path) =>
          url.pathname.startsWith(path),
        );
      },
    }),
    react(),
  ],
});
