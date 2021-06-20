import util from 'util';
import express, { Router } from 'express';
import multer from 'multer';
import socketio from 'socket.io';
import { StampJson, CommentJson } from '../messages';
import { data } from './data';
import { config } from './config';
import { setting } from './setting';

export function api(io: socketio.Server): Router {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, config.stamps),
  });

  const upload = util.promisify(multer({ storage }).single('file'));

  const api = express.Router();

  api.post('/messages/comment', (req, res) => {
    const msg = Object.assign({}, req.body) as CommentJson;
    io.emit('comment', msg);
    res.end();
  });

  api.post('/messages/stamp', (req, res) => {
    let stamp: StampJson;
    if (req.body?.path !== undefined) {
      const path = `/storage/stamps/${req.body.path}`;
      const sign = setting.signPath(path);
      stamp = Object.assign({ url: `${path}?s=${sign}` }, req.body) as StampJson;
    } else {
      stamp = Object.assign({}, req.body) as StampJson;
    }
    io.emit('stamp', stamp);
    res.end();
  });

  api.get('/stamps', (_req, res) => {
    res.json(data.getAllStamps());
  });

  api.get('/stamps/urls', (_req, res) => {
    res.json(
      data.getAllStamps().map((stamp) => {
        const path = `/storage/stamps/${stamp.path}`;
        const sign = setting.signPath(path);
        return `${config.serverUrl}${path}?s=${sign}`;
      })
    );
  });

  api.post('/stamps', async (req, res) => {
    await upload(req, res);

    const file = res.req?.file;
    if (file === undefined) return res.status(409).end();

    const label = req.body.label;
    const path = file.filename;
    const contentType = file.mimetype;

    data.addStamp(label, path, contentType);
    res.end();
  });

  api.delete('/stamps/:id', (req, res) => {
    const id = Number(req.params.id);
    data.deleteStamp(id);
    res.end();
  });

  api.post('/stamps/order', (req, res) => {
    data.updateStampOrder(req.body);
    res.end();
  });

  return api;
}
