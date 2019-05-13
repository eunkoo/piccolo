from node:8.10.0
maintainer eunkoo lee
run mkdir -p /app
workdir /app
copy ./files/package.json /app/
RUN npm install -g webpack webpack-dev-server webpack-cli  
run npm install  --no-progress --ignore-optional 
#env NODE_ENV=development
expose 8002 80
#run npm run build

