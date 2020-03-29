import fs from 'fs';
import express, { Router } from 'express';
import { data } from './data';
import { config } from './config';

export function storage(): Router {
  const storage = express.Router();

  storage.get('/stamps/:path', async (req, res) => {
    try {
      const path = req.param('path');

      const stamp = await data.getStampByPath(path);

      res.setHeader('Content-Type', stamp.contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');

      const stream = fs.createReadStream(`${config.stamps}/${stamp.path}`);
      stream.on('error', (_err) => res.status(404).end());
      stream.pipe(res);
    } catch (err) {
      res.status(500).end();
    }
  });

  return storage;
}
