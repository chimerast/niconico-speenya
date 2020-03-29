FROM node:12-alpine

RUN apk add --no-cache tini bash imagemagick

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ENV SERVER_URL SERVER_URL_SHOLD_BE_REPLACED

COPY . .
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 8080
ENV NODE_ENV production
ENV TS_NODE_PROJECT server/tsconfig.json

EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["./node_modules/.bin/ts-node ", "/app/server/index.ts"]
