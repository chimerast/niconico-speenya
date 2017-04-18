FROM mhart/alpine-node

WORKDIR /nico

ADD . .

RUN npm install

ENV PORT 80

EXPOSE 80

CMD npm start
