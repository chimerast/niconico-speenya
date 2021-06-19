FROM node:16-alpine

RUN apk add --no-cache tini bash imagemagick

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 8080
ENV NODE_ENV production
ENV TS_NODE_PROJECT server/tsconfig.json
ENV SERVER_URL http://localhost:8080

EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["npx", "nuxt", "start"]
