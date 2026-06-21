FROM node:20-alpine AS base
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

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
