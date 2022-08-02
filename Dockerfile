FROM node:18-buster-slim

WORKDIR /facebook

COPY . .

RUN corepack enable && yarn

ENTRYPOINT npm run dev