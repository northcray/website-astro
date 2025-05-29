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

ENV PUBLIC_DIRECTUS_URL=$PUBLIC_DIRECTUS_URL
ENV INTERNAL_DIRECTUS_URL=$INTERNAL_DIRECTUS_URL

RUN bun run build

FROM base AS runtime

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["bun", "run", "./dist/server/entry.mjs"]