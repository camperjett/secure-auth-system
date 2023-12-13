# Dockerfile
FROM node:21-alpine

# This line sets the working directory in the 
# Docker container to /app. All subsequent 
# commands in the Dockerfile will be run from this 
# directory.
WORKDIR /app
# This line copies the package.json file from your
#  local directory (where the Dockerfile is 
# located) into the Docker container’s current 
# working directory (/app).
COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 3000

# CMD npm start
CMD [ "node", "/src/server.js" ]