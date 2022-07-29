# vehicle_control
 
## Backend - Installation

Check that the Docker, docker-compose.yarm and .env files are configured

Run the command
``` bash
docker-compose up -d
```
Access the apache server and run create the database model with the following commands

```bash
docker exec -it api_tunap_php_apache_1 bash
php artisan migrate
php artisan db:seed
composer dump-autoload

```

Copy the google-cloud.json file to the /api/config folder


## Frontend - Installation

Acces folder /frontend

Check if the node version being used is 16.15.0

Run the command

```bash
yarn install
yarn start
```

## To release administrator access to the system, the following command must be executed directly on the database.
```sql 
update users set privilege = 'admin' where username = 'su-username'
```
