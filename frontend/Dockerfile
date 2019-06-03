from node:8.10.0
maintainer eunkoo lee
run mkdir -p /app
workdir /app
copy ./files/package.json /app/
RUN npm install -D webpack@3.1.0 webpack-dev-server@2.9.0 webpack-cli@2.0.0 \
&& npm install  --no-progress --ignore-optional 
run rm -rf /app/node_modules/dayspan-vuetify 
add ./files/node_modules/ /app/node_modules/
expose 8002 80

