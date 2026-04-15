FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/
RUN npm install

# Copy source including uploads
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build (DATABASE_URL is only needed at runtime, dummy value for prisma generate)
WORKDIR /app/backend
RUN DATABASE_URL=dummy npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]
