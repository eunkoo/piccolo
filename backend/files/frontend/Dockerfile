from node:12.1.0
maintainer eunkoo lee
run mkdir -p /app
workdir /app
copy ./files/package.json /app/
RUN npm install -g webpack@4.12.1 webpack-dev-server@3.1.4 webpack-cli@3.0.8  \
&& npm install  --no-progress --ignore-optional 
# run rm -rf /app/node_modules/dayspan-vuetify 
# add ./files/node_modules/ /app/node_modules/
expose 8002 80

