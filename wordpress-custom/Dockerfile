# Stage 1: Build PHP dependencies with Composer for your plugin
FROM composer:2 AS composer-stage
WORKDIR /app
# Copy only necessary files for Composer install
COPY plugins/react-woo-clerk-api/composer.json plugins/react-woo-clerk-api/composer.lock ./plugins/react-woo-clerk-api/ # Ensure these paths are correct relative to build context (wordpress-custom)
RUN composer install --no-dev --optimize-autoloader -d plugins/react-woo-clerk-api/ # Run composer within the plugin dir

# Stage 2: Build the WordPress image with your plugin
# Using a specific version for stability (WordPress 6.5.4, PHP 8.2, FPM, Alpine base)
FROM wordpress:6.5.4-php8.2-fpm-alpine

# Install necessary PHP extensions and system tools for WordPress and your plugin
# These extensions are common for WordPress/WooCommerce.
# Refer to your plugin's composer.json and WordPress/WooCommerce requirements if you encounter issues.
RUN set -ex; \
    apk add --no-cache --virtual .build-deps \
        git \
        unzip \
    ; \
    apk add --no-cache \
        php82-bcmath \
        php82-curl \
        php82-dom \
        php82-gd \
        php82-gmp \
        php82-intl \
        php82-json \
        php82-mbstring \
        php82-mysqli \
        php82-opcache \
        php82-pdo_mysql \
        php82-soap \
        php82-xml \
        php82-xmlreader \
        php82-xmlwriter \
        php82-zip \
    ; \
    docker-php-ext-install -j$(nproc) iconv; \
    # Clean up build dependencies
    apk del .build-deps

# Copy your custom plugin folder (e.g., react-woo-clerk-api)
# This path is relative to the build context (which is `wordpress-custom/` from docker-compose.yml)
COPY plugins/react-woo-clerk-api /var/www/html/wp-content/plugins/react-woo-clerk-api/

# Copy Composer's vendor folder from the first stage into your plugin's directory
COPY --from=composer-stage /app/plugins/react-woo-clerk-api/vendor /var/www/html/wp-content/plugins/react-woo-clerk-api/vendor

# Set correct permissions for WordPress files (crucial for plugins/themes/uploads)
RUN chown -R www-data:www-data /var/www/html
RUN find /var/www/html -type d -exec chmod g+s {} \;
RUN chmod -R 755 /var/www/html
RUN chmod -R 644 /var/www/html/wp-content/plugins/react-woo-clerk-api/vendor # Specifically for vendor folder

# Expose port 9000 (PHP-FPM default) for Traefik to route to
EXPOSE 9000