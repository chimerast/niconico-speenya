import { Database } from 'sqlite3';
import { config } from './config';
import { Stamp } from '@/messages';

class Data {
  private readonly db: Database;

  constructor(path: string = config.database) {
    this.db = new Database(path);
  }

  public async createTable(): Promise<void> {
    await this.serialize(async () => {
      await this.run(`
        CREATE TABLE IF NOT EXISTS tenants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT NOT NULL
        )`);

      await this.run(`
        CREATE TABLE IF NOT EXISTS stamps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
          label TEXT NOT NULL,
          path TEXT NOT NULL,
          contentType TEXT NOT NULL
        )`);

      const stamps = await this.all('PRAGMA table_info(stamps);');
      if (!stamps.some((stamp) => stamp.name === 'order')) {
        await this.run(`ALTER TABLE stamps ADD "order" INTEGER NOT NULL DEFAULT 0`);
      }

      await this.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
          tenant_id INTEGER NOT NULL,
          comment TEXT NOT NULL
        )`);
    });
  }

  public async getAllStamps(): Promise<Stamp[]> {
    return await this.all('SELECT * FROM stamps ORDER BY "order", id');
  }

  public async getStamp(id: number): Promise<Stamp> {
    return await this.get('SELECT * FROM stamps WHERE id = $id', id);
  }

  public async getStampByPath(path: string): Promise<Stamp> {
    return await this.get('SELECT * FROM stamps WHERE path = $path', path);
  }

  public async addStamp(label: string, path: string, contentType: string): Promise<void> {
    await this.run('INSERT INTO stamps(label, path, contentType) VALUES($label, $path, $content_type);', label, path, contentType);
  }

  public async deleteStamp(id: number): Promise<void> {
    await this.run('DELETE FROM stamps WHERE id = $id', id);
  }

  public async updateStampOrder(orders: { id: number; order: number }[]) {
    for (const order of orders) {
      await this.run('UPDATE stamps SET "order" = $order WHERE id = $id', order.order, order.id);
    }
  }

  private serialize(callback: () => Promise<void>): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.db.serialize(async () => {
        try {
          await callback();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private get(sql: string, ...params: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });
  }

  private all(sql: string, ...params: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    });
  }

  private run(sql: string, ...params: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(sql, params, (err) => (err ? reject(err) : resolve()));
    });
  }
}

export const data = new Data();
