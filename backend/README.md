# what consist of Dockerfile

not to copy whole 'node_modules' folder but copy package.json and install it.

    copy ./files/package.json /app/
    run npm install  --no-optional

to access here from other containers, expose port number.


    expose 8001 80



# How to make  backend container and run it

 create docker image using Dockerfile
     
     docker build -t piccolo_backend .

 exec docker conainer with port 8080

    docker run -it -p 8001:8001 --network db-conn piccolo_backend npm start

