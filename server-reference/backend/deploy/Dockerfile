FROM php:8.3-fpm-alpine
RUN apk add --no-cache sqlite-libs curl-dev sqlite-dev && docker-php-ext-install pdo_sqlite curl
WORKDIR /var/www/html
COPY src ./src
COPY public ./public
RUN mkdir -p /var/lib/netforge && chown -R www-data:www-data /var/lib/netforge
USER www-data
