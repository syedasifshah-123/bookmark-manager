import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const dbPath = join(__dirname, '../../bookmarks.db');

// const isCloud = process.env.TURSO_URL && process.env.TURSO_TOKEN;

export const client = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
});

export const db = drizzle(client, { schema });

export async function initDb() {
    await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '📁',
      color TEXT NOT NULL DEFAULT '#6366f1',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    await client.execute(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      favicon TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
