import express from 'express';
import config from '../nuxt.config';
import { io } from './io';
import { api } from './api';
import { storage } from './storage';
import { extension } from './extension';
import { data } from './data';

config.dev = process.env.NODE_ENV !== 'production';

const app = express();

data.createTable();

app.use('/api', api(io));
app.use('/storage', storage());
app.use('/extension.zip', extension());

module.exports = app;
