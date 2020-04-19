import path from 'path';
import { execSync } from 'child_process';
import express, { Router } from 'express';
import archiver from 'archiver';
import replace from 'replace-in-file';
import { version } from '../package.json';

replace.sync({
  files: './dist/extension/scripts/content_script.js',
  from: /SERVER_URL_SHOLD_BE_REPLACED/g,
  to: process.env.SERVER_URL ?? 'http://localhost:3000',
});

replace.sync({
  files: './dist/extension/manifest.json',
  from: /PACKAGE_VERSION_SHOLD_BE_REPLACED/g,
  to: version ?? '0.0.0',
});

const script = path.resolve(__dirname, '../extension/icons/convert.sh');
const target = path.resolve(__dirname, '../dist/extension/icons');

execSync(`${script} ${target}`);

export function extension(): Router {
  const extension = express.Router();

  extension.get('/', (_req, res) => {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Disposition', 'attachment; filename="extension.zip"');

      const archive = archiver('zip', {});
      archive.on('error', (_err) => res.status(404).end());
      archive.pipe(res);

      archive.directory('./dist/extension/', false);
      archive.finalize();
    } catch (err) {
      res.status(500).end();
    }
  });

  return extension;
}
