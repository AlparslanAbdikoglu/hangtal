# Use the official lightweight Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application source code
COPY . .

# Expose the port your Express app listens on
EXPOSE 4242

# Start the Node.js server
CMD ["node", "server.mjs"]
