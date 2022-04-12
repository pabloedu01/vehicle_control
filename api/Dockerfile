FROM php:7.3-apache

RUN apt-get update \
        && apt-get install -y \
            g++ \
            libicu-dev \
            libpq-dev \
            libzip-dev \
            zip \
            zlib1g-dev \
            libssh2-1 \
            curl \
            libcurl4-gnutls-dev \
            libpng-dev \
            libbz2-dev \
            libxml2-dev \
            libldb-dev \
            libldap2-dev \
            nano \
            iputils-ping \
        && docker-php-ext-install \
            intl \
            curl \
            gd \
            -j$(nproc) gd \
            gettext \
            bz2 \
            exif \
            opcache \
            zip \
            json \
            soap \
            xml \
            ldap \
            pdo \
            pdo_pgsql \
            pgsql \
            sockets

WORKDIR /var/www/tunap/api

RUN pecl install mongodb && docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN service apache2 restart

COPY . .

RUN chown -R www-data:www-data /var/www
RUN chmod 755 /var/www

RUN composer install

#CMD cat /etc/apache2/mods-available/rewrite.load
CMD php artisan key:generate
CMD a2enmod rewrite
CMD a2enmod headers
CMD a2enmod expires
CMD a2enmod proxy_fcgi setenvif
CMD a2enmod deflate
#CMD a2encof php7.3-fpm
#CMD service apache2 restart
#CMD ls -al /etc/apache2/mods-enabled/rewrite.load

RUN service apache2 restart

#EXPOSE 80
