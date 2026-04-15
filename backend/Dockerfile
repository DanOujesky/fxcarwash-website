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

# Build
WORKDIR /app/backend
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]
