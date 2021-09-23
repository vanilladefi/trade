FROM node:alpine as builder

USER root

RUN apk update && apk upgrade && \
  apk add --no-cache g++ make python3 py3-pip bash git hidapi openssh libusb-dev libusb curl

COPY --chown=node:node ./ /app

WORKDIR /app

USER node

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]
