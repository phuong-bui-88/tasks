FROM node:18-alpine

WORKDIR /app

# install curl
RUN apk add --no-cache curl

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./
RUN npm install

# Install @mui/material
RUN npm install @mui/material

RUN chown -R node:node /app/node_modules


# Copy the rest of the application
COPY . .

# Create the cache directory and set permissions
RUN mkdir -p .vite_cache && chmod -R 777 .vite_cache

# Start the application
CMD ["npm", "run","dev"]

EXPOSE 5173