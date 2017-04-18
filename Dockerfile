FROM node:6-alpine

WORKDIR /nico

ADD . .

RUN yarn install

ENV PORT 80

EXPOSE 80

CMD npm start
