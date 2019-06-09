FROM mysql:5.7

env MYSQL_DATABASE=edogawa01
env MYSQL_ROOT_PASSWORD=password
env MYSQL_USER=root
env MYSQL_PASSWORD=password
#env MYSQL_ROOT_HOST=127.0.0.1

COPY ./files/ /docker-entrypoint-initdb.d/

RUN sed -i -e"s/#bind-address/bind-address/g" /etc/mysql/mysql.conf.d/mysqld.cnf 
RUN sed -i "s/127.0.0.1/0.0.0.0/g"  /etc/mysql/mysql.conf.d/mysqld.cnf

# Setup the custom configuration
#ADD mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf
EXPOSE 3306 33060

