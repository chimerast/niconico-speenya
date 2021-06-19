import express from 'express';
import cors from 'cors';
import session from 'express-session';
import nuxtconfig from '../nuxt.config';
import { config } from './config';
import { io } from './io';
import { auth } from './auth';
import { api } from './api';
import { storage } from './storage';
import { extension } from './extension';
import { data } from './data';

nuxtconfig.dev = !config.production;

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true, proxy: true, cookie: { secure: 'auto' } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(app));

data.createTable();

app.use('/api', api(io));
app.use('/storage', storage());
app.use('/extension.zip', extension());

module.exports = app;
