FROM node:22-alpine AS builder
RUN corepack enable

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --immutable
COPY . .
RUN yarn workspaces focus --production --all

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

CMD ["node", "dist/src/main"]
