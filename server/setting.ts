import crypto from 'crypto';

import { data } from './data';

const sessionSecret = data.getSetting('SESSION_SECRET', () => crypto.randomBytes(16).toString('base64'));
const extensionSecret = data.getSetting('EXTENSION_SECRET', () => crypto.randomBytes(32).toString('base64'));

class Setting {
  public get sessionSecret(): string {
    return sessionSecret;
  }

  public get extensionSecret(): string {
    return extensionSecret;
  }

  public signPath(path: string): string {
    const hmac = crypto.createHmac('sha256', extensionSecret);
    hmac.update(path);
    return hmac.digest('base64').replace(/[+/=]/g, (match) => ({ '+': '-', '/': '_', '=': '' }[match] ?? ''));
  }
}

export const setting = new Setting();
