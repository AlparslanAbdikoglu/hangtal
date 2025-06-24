# Stage 1: Build the React application
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass build arguments (from docker-compose.yml args) into environment variables
# prefixed with REACT_APP_ for Create React App to pick them up.
ARG REACT_APP_CLERK_PUBLISHABLE_KEY
ARG REACT_APP_WORDPRESS_API_URL

ENV REACT_APP_CLERK_PUBLISHABLE_KEY=$REACT_APP_CLERK_PUBLISHABLE_KEY
ENV REACT_APP_WORDPRESS_API_URL=$REACT_APP_WORDPRESS_API_URL

RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine as production-stage
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built React app files
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]