import fs from 'fs';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const dataDir = process.env.DATA_DIR ?? './data';

fs.mkdirSync(`${dataDir}/stamps`, { recursive: true });

class Config {
  public get database(): string {
    return `${dataDir}/database`;
  }

  public get stamps(): string {
    return `${dataDir}/stamps`;
  }
}

export const config = new Config();
