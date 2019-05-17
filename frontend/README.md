# About Dockerfile

webpack-dev-server should be installed as well as modules in package.json.

this is support dynamic environment for implement.

     copy ./files/package.json /app/
     RUN npm install -g webpack webpack-dev-server webpack-cli  \
     && npm install  --no-progress --ignore-optional 
     
dayspan-vuetify was modified. so we remove original version and copy modified version.

     run rm -rf /app/node_modules/dayspan-vuetify 
     add ./files/node_modules/ /app/node_modules/


you can access 'localhost:8002' after running these docker containers

     expose 8002 80

# how to make frontend container and run it

make docker image with Dockerfile

     docker build -t piccolo_frontend .

run it with webpack-dev-server

     docker run -d -p 8002:8002 piccolo_frontend npm run dev
     
it runs this actual command : 

     webpack-dev-server --host 0.0.0.0  --inline --progress --config build/webpack.dev.conf.js



ref : https://github.com/ClickerMonkey/dayspan-vuetify

