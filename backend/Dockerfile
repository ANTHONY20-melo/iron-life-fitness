FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Use PostgreSQL schema if DATABASE_URL is PostgreSQL, otherwise use SQLite schema
RUN if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -qE "^(postgresql|postgres)://"; then \
      cp prisma/schema.postgres.prisma prisma/schema.prisma; \
      echo "Using PostgreSQL schema"; \
    else \
      cp prisma/schema.prisma prisma/schema.sqlite.prisma; \
      echo "Using SQLite schema"; \
    fi

EXPOSE 3340
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && echo \"$DATABASE_URL\" | grep -qE \"^(postgresql|postgres)://\"; then cp prisma/schema.postgres.prisma prisma/schema.prisma; fi && npx prisma db push --skip-generate && node dist/server.js"]
