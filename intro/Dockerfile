FROM node:latest
WORKDIR /app
COPY package.json /app
RUN yarn install
RUN yarn upgrade --latest
COPY . /app
RUN yarn build
CMD yarn start
EXPOSE 3000