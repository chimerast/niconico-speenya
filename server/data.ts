import sqlite3, { Database } from 'better-sqlite3';
import { Stamp } from '@/messages';
import { config } from './config';

class Data {
  private readonly db: Database;

  constructor(path: string = config.database) {
    this.db = sqlite3(path);
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tenants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS stamps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
          label TEXT NOT NULL,
          path TEXT NOT NULL,
          contentType TEXT NOT NULL,
          "order" INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
          tenant_id INTEGER NOT NULL,
          comment TEXT NOT NULL
        );
        `);
  }

  public getSetting(key: string, defaultValue: () => string): string {
    const value: string | undefined = this.db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).pluck().get();
    if (value !== undefined) return value;

    const newValue = defaultValue();
    this.db.prepare('REPLACE INTO settings(key, value) VALUES(?, ?);').run(key, newValue);
    return newValue;
  }

  public getAllStamps(): Stamp[] {
    return this.db.prepare('SELECT * FROM stamps ORDER BY "order", id').all();
  }

  public getStamp(id: number): Stamp {
    return this.db.prepare('SELECT * FROM stamps WHERE id = ?').bind(id).get();
  }

  public getStampByPath(path: string): Stamp {
    return this.db.prepare('SELECT * FROM stamps WHERE path = ?').bind(path).get();
  }

  public addStamp(label: string, path: string, contentType: string): void {
    this.db.prepare('INSERT INTO stamps(label, path, contentType) VALUES(?, ?, ?)').run(label, path, contentType);
  }

  public deleteStamp(id: number): void {
    this.db.prepare('DELETE FROM stamps WHERE id = ?').run(id);
  }

  public updateStampOrder(orders: { id: number; order: number }[]) {
    const stmt = this.db.prepare('UPDATE stamps SET "order" = @order WHERE id = @id');
    for (const order of orders) {
      stmt.run(order);
    }
  }
}

export const data = new Data();
