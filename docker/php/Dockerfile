FROM php:8.4-fpm

# প্রয়োজনীয় সিস্টেম ডিপেন্ডেন্সি ইন্সটল
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libpq-dev

# PHP এক্সটেনশন ইন্সটল (PostgreSQL এর জন্য)
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Redis এক্সটেনশন ইন্সটল করা (এটিই আপনার এরর সমাধান করবে)
RUN pecl install redis && docker-php-ext-enable redis

# কম্পোজার কপি করা
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www