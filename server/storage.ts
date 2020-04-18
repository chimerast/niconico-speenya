import path from 'path';
import express, { Router } from 'express';
import { data } from './data';
import { config } from './config';

export function storage(): Router {
  const storage = express.Router();

  storage.get('/stamps/:path', async (req, res) => {
    try {
      const stamp = await data.getStampByPath(req.param('path'));

      res.setHeader('Content-Type', stamp.contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');

      res.sendFile(path.resolve(__dirname, '..', `${config.stamps}/${stamp.path}`));
    } catch (err) {
      res.status(500).end();
    }
  });

  return storage;
}
