How to make  docker container and run it

 create docker image using Dockerfile
$ docker build -t backend .

 exec docker conainer with port 8080
$ docker run -it -p 8001:8001 --network db-conn backend npm start

