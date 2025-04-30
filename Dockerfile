FROM node:20-slim AS base
WORKDIR /app

FROM base AS install
COPY package.json  .
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY . .
COPY --from=install /app/node_modules node_modules
RUN pnpm run build

FROM caddy:2-alpine AS release
COPY --from=build /app/dist /app
COPY deploy/Caddyfile /etc/caddy

EXPOSE 80
