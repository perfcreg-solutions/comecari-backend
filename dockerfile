FROM node:lts-alpine
LABEL maintainer "oyewo.oluwafem@gmail.com"

WORKDIR /app
EXPOSE 4000

COPY package.json yarn.lock ./
RUN touch .env

RUN set -x && yarn

COPY . .

CMD [ "yarn", "start:dev" ]
