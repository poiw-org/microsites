## it uses node js image alpine version from image registries.
FROM node:latest
## it sets directory in the container to /app to store files and launch our app.
WORKDIR /app
## it copies the app to /app directory with dependencies.
COPY package.json /app
RUN yarn install
RUN yarn upgrade --latest
COPY . /app
RUN yarn build
CMD yarn start
##  it exposes the port where our app is running that is port 8080.
EXPOSE 3000

ENV HOST 0.0.0.0