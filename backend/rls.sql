-- Ejecutar en SQL Editor de Supabase

-- Columna para vincular Auth UUID con user ID entero
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_uid UUID UNIQUE;

-- Helper: obtener ID entero del usuario autenticado
CREATE OR REPLACE FUNCTION get_my_int_id()
RETURNS INTEGER LANGUAGE sql STABLE AS $$
  SELECT id FROM users WHERE supabase_uid = auth.uid();
$$;

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products: cualquiera lee, autenticados crean/editan
DROP POLICY IF EXISTS "products_public_select" ON products;
CREATE POLICY "products_public_select" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "products_auth_insert" ON products;
CREATE POLICY "products_auth_insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "products_own_update" ON products;
CREATE POLICY "products_own_update" ON products FOR UPDATE USING (seller_id = get_my_int_id());
DROP POLICY IF EXISTS "products_own_delete" ON products;
CREATE POLICY "products_own_delete" ON products FOR DELETE USING (seller_id = get_my_int_id());

-- Carts: solo el dueño
DROP POLICY IF EXISTS "carts_own_select" ON carts;
CREATE POLICY "carts_own_select" ON carts FOR SELECT USING (user_id = get_my_int_id());
DROP POLICY IF EXISTS "carts_own_insert" ON carts;
CREATE POLICY "carts_own_insert" ON carts FOR INSERT WITH CHECK (user_id = get_my_int_id());
DROP POLICY IF EXISTS "carts_own_delete" ON carts;
CREATE POLICY "carts_own_delete" ON carts FOR DELETE USING (user_id = get_my_int_id());

-- Favorites: solo el dueño
DROP POLICY IF EXISTS "favs_own_select" ON favorites;
CREATE POLICY "favs_own_select" ON favorites FOR SELECT USING (user_id = get_my_int_id());
DROP POLICY IF EXISTS "favs_own_insert" ON favorites;
CREATE POLICY "favs_own_insert" ON favorites FOR INSERT WITH CHECK (user_id = get_my_int_id());
DROP POLICY IF EXISTS "favs_own_delete" ON favorites;
CREATE POLICY "favs_own_delete" ON favorites FOR DELETE USING (user_id = get_my_int_id());

-- Follows: solo el dueño
DROP POLICY IF EXISTS "follows_own_select" ON follows;
CREATE POLICY "follows_own_select" ON follows FOR SELECT USING (user_id = get_my_int_id());
DROP POLICY IF EXISTS "follows_own_insert" ON follows;
CREATE POLICY "follows_own_insert" ON follows FOR INSERT WITH CHECK (user_id = get_my_int_id());
DROP POLICY IF EXISTS "follows_own_delete" ON follows;
CREATE POLICY "follows_own_delete" ON follows FOR DELETE USING (user_id = get_my_int_id());

-- Messages: el usuario ve/escribe en sus conversaciones
DROP POLICY IF EXISTS "messages_own_select" ON messages;
CREATE POLICY "messages_own_select" ON messages FOR SELECT USING (
  conv_id LIKE '%-' || get_my_int_id() || '%'
  OR conv_id LIKE get_my_int_id() || '-%'
);
DROP POLICY IF EXISTS "messages_own_insert" ON messages;
CREATE POLICY "messages_own_insert" ON messages FOR INSERT WITH CHECK (
  conv_id LIKE '%-' || get_my_int_id() || '%'
  OR conv_id LIKE get_my_int_id() || '-%'
);

-- Users: perfiles públicos, solo el dueño edita su propio perfil
DROP POLICY IF EXISTS "users_public_select" ON users;
CREATE POLICY "users_public_select" ON users FOR SELECT USING (true);
DROP POLICY IF EXISTS "users_own_insert" ON users;
CREATE POLICY "users_own_insert" ON users FOR INSERT WITH CHECK (supabase_uid = auth.uid());
DROP POLICY IF EXISTS "users_own_update" ON users;
CREATE POLICY "users_own_update" ON users FOR UPDATE USING (supabase_uid = auth.uid()) WITH CHECK (supabase_uid = auth.uid());
