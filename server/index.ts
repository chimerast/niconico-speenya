import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import { Nuxt, Builder } from 'nuxt';
import consola from 'consola';
import config from '../nuxt.config';
import { api } from './api';
import { storage } from './storage';
import { extension } from './extension';
import { data } from './data';

config.dev = process.env.NODE_ENV !== 'production';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

async function start() {
  await data.createTable();

  const nuxt = new Nuxt(config);
  await nuxt.ready();

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use('/api', api(io));
  app.use('/storage', storage());
  app.use('/extension', extension());
  app.use(nuxt.render);

  io.on('connection', (socket) => {
    consola.log('connected: ' + socket.request.connection.remoteAddress);

    socket.on('disconnect', () => {
      consola.log('disconnected: ' + socket.request.connection.remoteAddress);
    });
  });

  const { host, port } = nuxt.options.server;
  server.listen(port, host);

  consola.ready({
    message: `Server listening on https://${host}:${port}`,
    badge: true,
  });
}

start();
