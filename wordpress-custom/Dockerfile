FROM composer:2 AS composer-stage
WORKDIR /app

# Copy only necessary files for Composer install
COPY plugins/react-woo-clerk-api/composer.json plugins/react-woo-clerk-api/composer.lock ./plugins/react-woo-clerk-api/

# Install dependencies for the plugin (no-dev, optimized)
RUN composer install --no-dev --optimize-autoloader -d plugins/react-woo-clerk-api/

# Stage 2: Build the WordPress image with your plugin
FROM wordpress:6.5.4-php8.2-fpm-alpine

# Install necessary PHP extensions and system tools for WordPress and your plugin
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
    # Clean up build dependencies after installation
    apk del .build-deps

# Copy your full custom plugin folder (including source files and composer files)
COPY plugins/react-woo-clerk-api /var/www/html/wp-content/plugins/react-woo-clerk-api/

# Copy Composer's vendor folder from the composer-stage build
COPY --from=composer-stage /app/plugins/react-woo-clerk-api/vendor /var/www/html/wp-content/plugins/react-woo-clerk-api/vendor

# Set correct permissions for WordPress files (important for plugins/themes/uploads)
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod g+s {} \; \
    && chmod -R 755 /var/www/html \
    && chmod -R 644 /var/www/html/wp-content/plugins/react-woo-clerk-api/vendor

# Expose port 9000 for PHP-FPM
EXPOSE 9000