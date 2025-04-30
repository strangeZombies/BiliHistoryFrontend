FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS install
COPY package.json pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY . .
COPY --from=install /app/node_modules /app/node_modules
RUN pnpm run build

FROM caddy:2-alpine AS release
COPY --from=build /app/dist /app
COPY deploy/Caddyfile /etc/caddy

EXPOSE 80