# Stage 1: Build the React application with Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_WOO_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

#build
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine AS production
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
