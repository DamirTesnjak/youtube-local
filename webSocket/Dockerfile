# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

RUN apk update && apk add bash

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS websocket

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY webSocket/package.json ./
COPY webSocket/package-lock.json ./
COPY webSocket/server.js ./

RUN npm install

ENV PORT=5001

EXPOSE 5001

CMD DEBUG=socket.io:* node server.js