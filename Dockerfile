FROM mhart/alpine-node

WORKDIR /nico

ADD . .

RUN npm install

ENV PORT 8080

EXPOSE 8080

CMD npm start
