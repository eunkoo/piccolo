# how to make frontend container and run it

make docker image with Dockerfile

     docker build -t piccolo_frontend .

run it with webpack-dev-server

     docker run -d -p 8002:8002 piccolo_frontend npm run dev
     
it runs this actual command : 

     webpack-dev-server --host 0.0.0.0  --inline --progress --config build/webpack.dev.conf.js

