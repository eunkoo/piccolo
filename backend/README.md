How to make  docker container and run it

 create docker image using Dockerfile
$ docker build -t piccolo_backend .

 exec docker conainer with port 8080
$ docker run -it -p 8001:8001 --network db-conn piccolo_backend npm start

