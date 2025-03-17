# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

RUN apk update && apk add bash

FROM base AS websocket

WORKDIR /app

COPY webSocket/package.json ./
COPY webSocket/package-lock.json ./
COPY webSocket/server.js ./

RUN npm install

ENV PORT=5001

EXPOSE 5001

CMD DEBUG=socket.io:* node server.js