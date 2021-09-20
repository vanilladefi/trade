FROM node:alpine as installer

USER root

RUN apk update && apk upgrade && \
  apk add --no-cache g++ make python3 py3-pip bash git hidapi openssh libusb-dev libusb curl

RUN mkdir -p /app

COPY --chown=node:node ./ /app

RUN chown node:node /app

WORKDIR /app

USER node

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]
