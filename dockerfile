
FROM php:8.2-fpm


RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    default-mysql-client \
    curl \
    && docker-php-ext-install pdo_mysql pcntl


COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


WORKDIR /var/www/html


COPY hombresLoboLaravel/ ./



RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 8000

CMD ["php-fpm"]
