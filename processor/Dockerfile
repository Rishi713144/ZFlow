FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl


FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate

RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
CMD ["node", "dist/index.js"]
