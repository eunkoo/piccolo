from node:12.1.0
maintainer eunkoo lee
run mkdir -p /app
workdir /app
add ./files/ /app/
run npm install  --no-optional
run npm audit fix  --no-optional
env node_env product
expose 8001 8001
cmd ["npm","start"]

