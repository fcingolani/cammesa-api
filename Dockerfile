FROM node:argon-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN mkdir -p /usr/src/app && yarn install

EXPOSE 3000
CMD [ "npm", "start" ]