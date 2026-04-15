FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/
RUN npm install

# Copy source including uploads
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build (valid postgres URL needed for prisma.config.ts env() check, no real connection made)
WORKDIR /app/backend
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]
