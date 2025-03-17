# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

RUN apk update && apk add bash

FROM base AS videoStream

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY videoStreamingServer/package.json ./
COPY videoStreamingServer/package-lock.json ./
COPY videoStreamingServer/server.js ./
COPY public/favicon.ico ./

RUN npm install

ENV PORT=3000

EXPOSE 4001

CMD node server.js