-- Ejecutar esto en Supabase SQL Editor (SQL Editor → New query)
-- Project Settings → Database → Connection string → URI

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  photo TEXT DEFAULT 'person',
  description TEXT DEFAULT '',
  rating DECIMAL DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  avg_response_time TEXT DEFAULT '—',
  join_date TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER NOT NULL,
  icon TEXT DEFAULT 'checkroom',
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  brand TEXT,
  condition TEXT,
  gender TEXT,
  style TEXT,
  location TEXT,
  description TEXT,
  date_posted TEXT,
  likes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS carts (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name TEXT,
  icon TEXT,
  effective_price INTEGER,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS follows (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, seller_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conv_id TEXT NOT NULL,
  from_user INTEGER NOT NULL,
  text TEXT NOT NULL,
  time TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON messages(conv_id);
