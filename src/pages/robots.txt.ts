import { robotsDisallowPaths } from "@/const.ts";

export const prerender = true;

import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Disallow: /
${robotsDisallowPaths.map((path) => `Disallow: ${path}`).join("\n")}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
