import path from 'path';
import express, { Router } from 'express';
import { data } from './data';
import { config } from './config';

export function storage(): Router {
  const storage = express.Router();

  storage.get('/stamps/:path', (req, res) => {
    try {
      const stamp = data.getStampByPath(req.params.path);

      res.sendFile(path.resolve(__dirname, '..', `${config.stamps}/${stamp.path}`), {
        maxAge: '30d',
        immutable: true,
        headers: {
          'content-type': stamp.contentType,
        },
      });
    } catch (err) {
      res.status(500).end();
    }
  });

  return storage;
}
