FROM oven/bun:alpine AS base
WORKDIR /app

COPY package.json bun.lock ./

FROM base AS prod-deps
RUN bun i --omit dev --frozen-lockfile --ignore-scripts

FROM base AS build-deps
RUN bun i --frozen-lockfile --ignore-scripts

FROM build-deps AS build
COPY . .

ARG PUBLIC_DIRECTUS_URL
ARG INTERNAL_DIRECTUS_URL
ARG PUBLIC_TURNSTILE_SITE_KEY

ENV PUBLIC_DIRECTUS_URL=$PUBLIC_DIRECTUS_URL
ENV INTERNAL_DIRECTUS_URL=$INTERNAL_DIRECTUS_URL
ENV PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY

RUN --mount=type=secret,id=TURNSTILE_SECRET_KEY \
    --mount=type=secret,id=CLOUDFLARE_SERVICE_TOKEN_ID \
    --mount=type=secret,id=CLOUDFLARE_SERVICE_TOKEN_SECRET \
    --mount=type=secret,id=STRIPE_SECRET_KEY \
  export TURNSTILE_SECRET_KEY=$(cat /run/secrets/TURNSTILE_SECRET_KEY) && \
  export CLOUDFLARE_SERVICE_TOKEN_ID=$(cat /run/secrets/CLOUDFLARE_SERVICE_TOKEN_ID) && \
  export CLOUDFLARE_SERVICE_TOKEN_SECRET=$(cat /run/secrets/CLOUDFLARE_SERVICE_TOKEN_SECRET) && \
  export STRIPE_SECRET_KEY=$(cat /run/secrets/STRIPE_SECRET_KEY) && \
  bun run build

FROM node:24-alpine AS runtime

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]