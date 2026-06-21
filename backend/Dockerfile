FROM node:22-alpine AS base
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Runtime layer
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 10000

CMD ["node", "server.js"]
