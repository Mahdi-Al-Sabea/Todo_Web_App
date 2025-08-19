FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json + lock first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Start the app with ts-node
CMD ["npx", "ts-node", "src/index.ts"]