FROM node:12-alpine

RUN apk add --no-cache tini bash imagemagick zip

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ENV HOST 0.0.0.0
ENV PORT 8080
ENV SERVER_URL SERVER_URL_SHOLD_BE_REPLACED

COPY . .
RUN npm run build

EXPOSE 8080

ENV NODE_ENV production
ENV TS_NODE_PROJECT server/tsconfig.json

ENTRYPOINT ["tini", "--"]
CMD ["npx", "ts-node", "/app/server/index.ts"]
