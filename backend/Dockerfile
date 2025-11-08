FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Set environment
ENV NODE_ENV=production \
    PORT=5000

# Expose API port
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]