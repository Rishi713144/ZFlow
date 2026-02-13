FROM node:20-alpine
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN pnpm build
EXPOSE 3001
CMD ["pnpm", "start"]
