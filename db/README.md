# About Dockerfile

Default database init file should be copyed to 'docker-entrypoint-initdb.d'

    COPY ./files/ /docker-entrypoint-initdb.d/

Should set bind-address to 0.0.0.0, not a 127.0.0.1

    RUN sed -i -e"s/#bind-address/bind-address/g" /etc/mysql/mysql.conf.d/mysqld.cnf 
    RUN sed -i "s/127.0.0.1/0.0.0.0/g"  /etc/mysql/mysql.conf.d/mysqld.cnf

default mysql port is 3306
   
    EXPOSE 3306 33060


# How to make database container and run it

 create database based on mysql:5.7 using Dockerfile

    docker build -t piccolo_mysql .

 exec container with init sql data file

    docker run -d -p 3306:3306 --name piccolo_mysql --network db-conn  piccolo_mysql

 enter the container

    docker exec -it piccolo-mysql bash

 go to mysql in container

    mysql -u root -p
    > password
