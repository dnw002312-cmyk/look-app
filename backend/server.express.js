require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ===== AUTH =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email);
    if (error) throw error;
    if (!users || users.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
    const { password, ...safeUser } = users[0];
    res.json({ token: String(safeUser.id), user: safeUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { data: existing } = await supabase.from('users').select('id').eq('email', email);
    if (existing && existing.length > 0) return res.status(400).json({ error: 'El correo ya existe' });
    const { data: newUser, error } = await supabase.from('users').insert({
      name, email, password, photo: 'person', join_date: new Date().toISOString().split('T')[0]
    }).select().single();
    if (error) throw error;
    const { password: _, ...safeUser } = newUser;
    res.json({ token: String(safeUser.id), user: safeUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  req.userId = parseInt(token);
  next();
}

// ===== PRODUCTS =====
app.get('/api/products', async (req, res) => {
  try {
    let query = supabase.from('products').select('*');
    const { category, query: q, size, color, brand, condition, minPrice, maxPrice } = req.query;
    if (category && category !== 'todas') query = query.eq('category', category);
    if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`);
    if (size) query = query.eq('size', size);
    if (color) query = query.eq('color', color);
    if (brand) query = query.eq('brand', brand);
    if (condition) query = query.eq('condition', condition);
    if (minPrice) query = query.gte('price', parseInt(minPrice));
    if (maxPrice) query = query.lte('price', parseInt(maxPrice));
    query = query.order('date_posted', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', parseInt(req.params.id)).single();
    if (error || !data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const { name, price, description, category, size, color, brand, condition, icon } = req.body;
    const { data, error } = await supabase.from('products').insert({
      name, category, price: parseInt(price), icon: icon || 'checkroom',
      seller_id: req.userId, size, color, brand, condition, description,
      date_posted: new Date().toISOString().split('T')[0]
    }).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== USERS =====
app.get('/api/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id, name, email, photo, description, rating, sales_count, followers, following, avg_response_time, join_date').eq('id', parseInt(req.params.id)).single();
    if (error || !data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { name, email, description, photo, newPassword } = req.body;
    const { data: existing } = await supabase.from('users').select('*').eq('id', req.userId).single();
    if (!existing) return res.status(404).json({ error: 'No encontrado' });
    if (email && email !== existing.email) {
      const { data: dup } = await supabase.from('users').select('id').eq('email', email).neq('id', req.userId);
      if (dup && dup.length > 0) return res.status(400).json({ error: 'El correo ya existe' });
    }
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (description !== undefined) updates.description = description;
    if (photo) updates.photo = photo;
    if (newPassword) updates.password = newPassword;
    const { data, error } = await supabase.from('users').update(updates).eq('id', req.userId).select('id, name, email, photo, description, rating, sales_count, followers, following, avg_response_time, join_date').single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== CART =====
app.get('/api/cart', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('carts').select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq('user_id', req.userId);
    if (error) throw error;
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/cart', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const { data: existing } = await supabase.from('carts').select('product_id').eq('user_id', req.userId).eq('product_id', productId);
    if (existing && existing.length > 0) return res.status(400).json({ error: 'Ya está en el carrito' });
    const { data: product } = await supabase.from('products').select('id, name, icon, price').eq('id', productId).single();
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    const { error } = await supabase.from('carts').insert({
      user_id: req.userId, product_id: product.id,
      name: product.name, icon: product.icon, effective_price: product.price
    });
    if (error) throw error;
    const { data: items } = await supabase.from('carts').select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq('user_id', req.userId);
    res.json(items || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/cart/:productId', auth, async (req, res) => {
  try {
    await supabase.from('carts').delete().eq('user_id', req.userId).eq('product_id', parseInt(req.params.productId));
    const { data } = await supabase.from('carts').select('product_id AS id, name, icon, effective_price AS "effectivePrice"').eq('user_id', req.userId);
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/cart/checkout', auth, async (req, res) => {
  try {
    await supabase.from('carts').delete().eq('user_id', req.userId);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== FAVORITES =====
app.get('/api/favorites', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('favorites').select('product_id').eq('user_id', req.userId);
    if (error) throw error;
    res.json((data || []).map(r => r.product_id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/favorites/toggle', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const { data: existing } = await supabase.from('favorites').select('product_id').eq('user_id', req.userId).eq('product_id', productId);
    if (existing && existing.length > 0) {
      await supabase.from('favorites').delete().eq('user_id', req.userId).eq('product_id', productId);
    } else {
      await supabase.from('favorites').insert({ user_id: req.userId, product_id: productId });
    }
    const { data } = await supabase.from('favorites').select('product_id').eq('user_id', req.userId);
    res.json((data || []).map(r => r.product_id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== FOLLOWS =====
app.get('/api/follows', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('follows').select('seller_id').eq('user_id', req.userId);
    if (error) throw error;
    res.json((data || []).map(r => r.seller_id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/follows/toggle', auth, async (req, res) => {
  try {
    const { sellerId } = req.body;
    const { data: existing } = await supabase.from('follows').select('seller_id').eq('user_id', req.userId).eq('seller_id', sellerId);
    if (existing && existing.length > 0) {
      await supabase.from('follows').delete().eq('user_id', req.userId).eq('seller_id', sellerId);
    } else {
      await supabase.from('follows').insert({ user_id: req.userId, seller_id: sellerId });
    }
    const { data } = await supabase.from('follows').select('seller_id').eq('user_id', req.userId);
    res.json((data || []).map(r => r.seller_id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== MESSAGES =====
app.get('/api/messages', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { data, error } = await supabase
      .from('messages')
      .select('conv_id, from_user, text, time')
      .or(`conv_id.ilike.%-${userId},conv_id.ilike.${userId}-%`);
    if (error) throw error;
    const convs = {};
    for (const msg of data || []) {
      if (!convs[msg.conv_id]) convs[msg.conv_id] = [];
      convs[msg.conv_id].push({ from: msg.from_user, text: msg.text, time: msg.time });
    }
    res.json(convs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:convId', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('from_user AS "from", text, time')
      .eq('conv_id', req.params.convId)
      .order('id', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages/:convId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { error } = await supabase.from('messages').insert({
      conv_id: req.params.convId, from_user: req.userId, text, time
    });
    if (error) throw error;
    const { data } = await supabase
      .from('messages')
      .select('from_user AS "from", text, time')
      .eq('conv_id', req.params.convId)
      .order('id', { ascending: true });
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== AI — Gemini Outfit Generator =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/ai/outfits', async (req, res) => {
  try {
    const { vibe, styles, sizes } = req.body;
    if (!vibe) return res.status(400).json({ error: 'Se requiere "vibe"' });
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'pon-tu-api-key-aqui') {
      return res.status(400).json({ error: 'API key de Gemini no configurada. Edita backend/.env y pon tu GEMINI_API_KEY.' });
    }

    const { data: products } = await supabase.from('products').select('*').limit(50);
    const catalog = (products || []).map(p => ({
      name: p.name, category: p.category, brand: p.brand,
      price: `₡${p.price}`, size: p.size,
      color: p.color, condition: p.condition, gender: p.gender,
      style: p.style, description: p.description,
    }));

    const prompt = `Eres un stylist personal experto en moda circular y segunda mano.

Genera EXACTAMENTE 4 outfits completos para el vibe: "${vibe}".
Estilos del usuario: ${(styles || []).join(', ') || 'variado'}.
Tallas: top ${sizes?.top || 'M'}, bottom ${sizes?.bottom || 'M'}, shoes ${sizes?.shoes || '40'}.

Catálogo disponible: ${JSON.stringify(catalog)}

IMPORTANTE: Para cada outfit usa NOMBRES de prendas y marcas CREÍBLES y REALISTAS de segunda mano (Zara, Mango, Levi's, H&M, Nike, COS, Massimo Dutti, vintage, etc). Precios EN COLONES COSTARRICENSES (₡): entre ₡3,000 y ₡60,000 por pieza. 3-4 items por outfit.

Responde SOLO con JSON válido (sin markdown, sin \`\`\`):
{"outfits":[{"title":"Nombre creativo del look","description":"1 frase descriptiva","items":[{"type":"Top|Bottom|Shoes|Accesorio|Outerwear","name":"Nombre prenda","brand":"Marca","price":25,"color":"Color","why":"Por qué encaja en este look"}],"totalPrice":120,"tags":["estilo1","estilo2"]}]}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 4096,
      },
    };

    console.log('🤖 Llamando a Gemini con vibe:', vibe);
    console.log('📦 Body:', JSON.stringify(body, null, 2).substring(0, 500) + '...');

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('❌ Gemini error:', geminiRes.status);
      console.error('📄 Error completo:', errText);
      return res.status(502).json({ error: `Gemini API error ${geminiRes.status}: ${errText.slice(0, 300)}` });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: 'Respuesta vacía de Gemini' });

    let outfits;
    try {
      outfits = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) outfits = JSON.parse(m[0]);
      else throw new Error('No se pudo parsear JSON');
    }

    res.json(outfits);
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== STARTUP =====
async function seed() {
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  if (userCount && userCount > 0) return;

  await supabase.from('users').insert([
    { id: 1, name: 'María García', email: 'maria@email.com', password: 'pass', photo: 'woman', description: 'Amante de la moda circular. Vendo prendas que ya no uso.', rating: 4.8, sales_count: 23, followers: 45, following: 12, avg_response_time: '2h', join_date: '2024-01-15' },
    { id: 2, name: 'Carlos López', email: 'carlos@email.com', password: 'pass', photo: 'man', description: 'Ropa de marca a buen precio. Todo original.', rating: 4.5, sales_count: 15, followers: 28, following: 8, avg_response_time: '1h', join_date: '2024-03-20' },
    { id: 3, name: 'Ana Martínez', email: 'ana@email.com', password: 'pass', photo: 'woman', description: 'Vintage lover. Prendas únicas y sostenibles.', rating: 4.9, sales_count: 31, followers: 67, following: 22, avg_response_time: '3h', join_date: '2023-11-05' },
  ]);

  await supabase.from('products').insert([
    { id: 1, name: 'Vestido floral verano', category: 'mujer', price: 45000, icon: 'skirt', seller_id: 1, size: 'M', color: 'Multicolor', brand: 'Zara', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'San José', description: 'Vestido floral perfecto para el verano.', date_posted: '2024-06-01', likes: 12 },
    { id: 2, name: 'Chaqueta de cuero', category: 'hombre', price: 120000, icon: 'checkroom', seller_id: 2, size: 'L', color: 'Negro', brand: "Levi's", condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Heredia', description: 'Chaqueta de cuero auténtica.', date_posted: '2024-05-15', likes: 8 },
    { id: 3, name: 'Bolso tote bag', category: 'accesorios', price: 60000, icon: 'handbag', seller_id: 1, size: 'Único', color: 'Marrón', brand: 'Mango', condition: 'nuevo', gender: 'mujer', style: 'elegante', location: 'San José', description: 'Bolso tote bag de Mango.', date_posted: '2024-06-10', likes: 5 },
    { id: 4, name: 'Camisa lino blanca', category: 'hombre', price: 55000, icon: 'shirt', seller_id: 2, size: 'M', color: 'Blanco', brand: 'Massimo Dutti', condition: 'como nuevo', gender: 'hombre', style: 'formal', location: 'Heredia', description: 'Camisa de lino blanca.', date_posted: '2024-04-20', likes: 3 },
    { id: 5, name: 'Falda plisada', category: 'mujer', price: 40000, icon: 'skirt', seller_id: 3, size: 'S', color: 'Azul', brand: 'H&M', condition: 'usado', gender: 'mujer', style: 'casual', location: 'Alajuela', description: 'Falda plisada azul.', date_posted: '2024-06-05', likes: 7 },
    { id: 6, name: 'Gafas de sol aviador', category: 'accesorios', price: 35000, icon: 'sunglasses', seller_id: 3, size: 'Único', color: 'Dorado', brand: 'Ray-Ban', condition: 'como nuevo', gender: 'unisex', style: 'casual', location: 'Alajuela', description: 'Gafas aviador clásicas.', date_posted: '2024-05-01', likes: 15 },
    { id: 7, name: 'Abrigo invernal largo', category: 'mujer', price: 150000, icon: 'checkroom', seller_id: 1, size: 'L', color: 'Gris', brand: 'Stradivarius', condition: 'poco uso', gender: 'mujer', style: 'elegante', location: 'San José', description: 'Abrigo largo gris.', date_posted: '2024-02-10', likes: 4 },
    { id: 8, name: 'Zapatos casual cuero', category: 'hombre', price: 85000, icon: 'footsteps', seller_id: 2, size: '42', color: 'Marrón', brand: 'Camper', condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Heredia', description: 'Zapatos Camper de cuero.', date_posted: '2024-04-10', likes: 6 },
    { id: 9, name: 'Sombrero tejido', category: 'accesorios', price: 25000, icon: 'hiking', seller_id: 3, size: 'Único', color: 'Beige', brand: 'El Corte Inglés', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'Alajuela', description: 'Sombrero de paja tejido.', date_posted: '2024-06-15', likes: 2 },
    { id: 10, name: 'Jeans pitillo negro', category: 'mujer', price: 50000, icon: 'checkroom', seller_id: 3, size: '36', color: 'Negro', brand: 'Pull&Bear', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'Alajuela', description: 'Jeans pitillo negro.', date_posted: '2024-06-12', likes: 9 },
    { id: 11, name: 'Bufanda de lana', category: 'accesorios', price: 20000, icon: 'checkroom', seller_id: 1, size: 'Único', color: 'Rojo', brand: 'Zara', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'San José', description: 'Bufanda de lana roja.', date_posted: '2024-01-20', likes: 1 },
    { id: 12, name: 'Camiseta algodón básica', category: 'hombre', price: 25000, icon: 'shirt', seller_id: 2, size: 'L', color: 'Blanco', brand: 'Nike', condition: 'nuevo', gender: 'hombre', style: 'deportivo', location: 'Heredia', description: 'Camiseta Nike básica.', date_posted: '2024-06-08', likes: 3 },
  ]);
  console.log('Seed data inserted');
}

const PORT = process.env.PORT || 3001;
seed().then(() => {
  app.listen(PORT, () => console.log(`LOOK API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
