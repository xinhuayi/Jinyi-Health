import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { products } from "@/lib/catalog";
import { hashPassword } from "./crypto";

type SqliteDb = Database.Database;

declare global {
  // eslint-disable-next-line no-var
  var __jinyiDb: SqliteDb | undefined;
}

const dataDir = path.join(process.cwd(), "data");
const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "jinyi-commerce.sqlite");

export function getDb() {
  if (!globalThis.__jinyiDb) {
    mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db);
    seed(db);
    globalThis.__jinyiDb = db;
  }

  return globalThis.__jinyiDb;
}

function migrate(db: SqliteDb) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      password_hash TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL,
      unit TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      storage TEXT NOT NULL DEFAULT '',
      usage TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL DEFAULT '[]',
      compliance TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active',
      stock INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      receiver_name TEXT NOT NULL,
      receiver_phone TEXT NOT NULL,
      province TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      detail TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      address_id INTEGER,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      total_amount INTEGER NOT NULL,
      receiver_snapshot TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      unit_price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      provider TEXT NOT NULL DEFAULT 'wechat',
      status TEXT NOT NULL DEFAULT 'mock_created',
      prepay_id TEXT,
      amount INTEGER NOT NULL,
      payload TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS compliance_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );
  `);
}

function seed(db: SqliteDb) {
  const existingProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as {
    count: number;
  };

  if (existingProducts.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        slug, name, subtitle, price, unit, category, tags, storage, usage,
        summary, details, compliance, stock
      ) VALUES (
        @slug, @name, @subtitle, @price, @unit, @category, @tags, @storage, @usage,
        @summary, @details, @compliance, @stock
      )
    `);

    const seedProducts = db.transaction(() => {
      for (const product of products) {
        insertProduct.run({
          ...product,
          tags: JSON.stringify(product.tags),
          details: JSON.stringify(product.details),
          compliance: JSON.stringify(product.compliance),
          stock: 100,
        });
      }
    });

    seedProducts();
  }

  const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();

  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (phone, name, role, password_hash)
      VALUES (@phone, @name, 'admin', @passwordHash)
    `).run({
      phone: process.env.ADMIN_INITIAL_PHONE ?? "18800000000",
      name: "商城管理员",
      passwordHash: hashPassword(process.env.ADMIN_INITIAL_PASSWORD ?? "admin123456"),
    });
  }
}

export function parseJsonArray(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mapProduct(row: Record<string, unknown>) {
  return {
    ...row,
    tags: parseJsonArray(row.tags as string),
    details: parseJsonArray(row.details as string),
    compliance: parseJsonArray(row.compliance as string),
  };
}
