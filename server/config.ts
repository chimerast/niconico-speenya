import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const production = process.env.NODE_ENV === 'production';
const serverUrl = process.env.SERVER_URL ?? 'http://localhost:3000';
const dataDir = process.env.DATA_DIR ?? './data';
const sessionSecret = process.env.SESSION_SECRET ?? crypto.randomBytes(16).toString('base64');

fs.mkdirSync(`${dataDir}/stamps`, { recursive: true });

class Config {
  public get production(): boolean {
    return production;
  }

  public get serverUrl(): string {
    return serverUrl;
  }

  public get sessionSecret(): string {
    return sessionSecret;
  }

  public get database(): string {
    return `${dataDir}/database`;
  }

  public get stamps(): string {
    return `${dataDir}/stamps`;
  }
}

export const config = new Config();
