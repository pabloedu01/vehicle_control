# vehicle_control
Controle
.

## Backend - Installation

Check that the Docker, docker-compose.yarm and .env files are configured

Run the command docker-compose up -d

Access the apache server and run create the database model with the following commands

'''bash
docker exec -it api_tunap_php_apache_1 bash
php artisan migrate
php artisan db:seed
composer dump-autoload

'''

Copy the google-cloud.json file to the /api/config folder
