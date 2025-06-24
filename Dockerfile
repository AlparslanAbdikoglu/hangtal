FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (for npm)
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

# Build the React app (Vite defaults to 'dist' folder)
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]