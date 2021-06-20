import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { setting } from './setting';
import { io } from './io';
import { auth } from './auth';
import { api } from './api';
import { storage } from './storage';
import { extension } from './extension';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(session({ secret: setting.sessionSecret, resave: false, saveUninitialized: true, proxy: true, cookie: { secure: 'auto' } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(app));

app.use('/api', api(io));
app.use('/storage', storage());
app.use('/extension.zip', extension());

export default app;
