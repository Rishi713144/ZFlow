FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl


FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install

# Generate client (schema must be valid here)
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate

RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001

# Run migrations with retry loop to wait for Postgres to be ready
CMD ["sh", "-c", "until npx prisma migrate deploy; do echo 'Migration failed, retrying in 5s...' && sleep 5; done && node dist/index.js"]
