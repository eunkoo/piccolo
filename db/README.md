//create database based on mysql:5.7 using Dockerfile
# docker build -t piccolo_mysql .

//exec container with init sql data file
# docker run -d -p 3306:3306 --name piccolo_mysql --network db-conn  piccolo_mysql

//enter the container
# docker exec -it piccolo-mysql bash

//go to mysql in container
# mysql -u root -p
> password
