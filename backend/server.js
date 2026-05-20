const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA = path.join(__dirname, 'data');
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });

function read(name) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, name + '.json'), 'utf8')); }
  catch { return []; }
}
function write(name, data) {
  fs.writeFileSync(path.join(DATA, name + '.json'), JSON.stringify(data, null, 2));
}

// Seed
if (!fs.existsSync(path.join(DATA, 'users.json'))) {
  write('users', [
    { id: 1, name: 'María García', email: 'maria@email.com', photo: 'woman', description: 'Amante de la moda circular.', rating: 4.8, salesCount: 23, followers: 45, following: 12, avgResponseTime: '2h', joinDate: '2024-01-15' },
    { id: 2, name: 'Carlos López', email: 'carlos@email.com', photo: 'man', description: 'Ropa de marca a buen precio.', rating: 4.5, salesCount: 15, followers: 28, following: 8, avgResponseTime: '1h', joinDate: '2024-03-20' },
    { id: 3, name: 'Ana Martínez', email: 'ana@email.com', photo: 'woman', description: 'Vintage lover.', rating: 4.9, salesCount: 31, followers: 67, following: 22, avgResponseTime: '3h', joinDate: '2023-11-05' },
  ]);
  write('products', [
    { id: 1, name: 'Vestido floral verano', category: 'mujer', price: 45000, icon: 'skirt', sellerId: 1, size: 'M', color: 'Multicolor', brand: 'Zara', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'San José', description: 'Vestido floral perfecto para el verano.', datePosted: '2024-06-01', likes: 12 },
    { id: 2, name: 'Chaqueta de cuero', category: 'hombre', price: 120000, icon: 'checkroom', sellerId: 2, size: 'L', color: 'Negro', brand: "Levi's", condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Heredia', description: 'Chaqueta de cuero auténtica.', datePosted: '2024-05-15', likes: 8 },
    { id: 3, name: 'Bolso tote bag', category: 'accesorios', price: 60000, icon: 'handbag', sellerId: 1, size: 'Único', color: 'Marrón', brand: 'Mango', condition: 'nuevo', gender: 'mujer', style: 'elegante', location: 'San José', description: 'Bolso tote bag de Mango.', datePosted: '2024-06-10', likes: 5 },
    { id: 4, name: 'Camisa lino blanca', category: 'hombre', price: 55000, icon: 'shirt', sellerId: 2, size: 'M', color: 'Blanco', brand: 'Massimo Dutti', condition: 'como nuevo', gender: 'hombre', style: 'formal', location: 'Heredia', description: 'Camisa de lino blanca.', datePosted: '2024-04-20', likes: 3 },
    { id: 5, name: 'Falda plisada', category: 'mujer', price: 40000, icon: 'skirt', sellerId: 3, size: 'S', color: 'Azul', brand: 'H&M', condition: 'usado', gender: 'mujer', style: 'casual', location: 'Alajuela', description: 'Falda plisada azul.', datePosted: '2024-06-05', likes: 7 },
    { id: 6, name: 'Gafas de sol aviador', category: 'accesorios', price: 35000, icon: 'sunglasses', sellerId: 3, size: 'Único', color: 'Dorado', brand: 'Ray-Ban', condition: 'como nuevo', gender: 'unisex', style: 'casual', location: 'Alajuela', description: 'Gafas aviador clásicas.', datePosted: '2024-05-01', likes: 15 },
    { id: 7, name: 'Abrigo invernal largo', category: 'mujer', price: 150000, icon: 'checkroom', sellerId: 1, size: 'L', color: 'Gris', brand: 'Stradivarius', condition: 'poco uso', gender: 'mujer', style: 'elegante', location: 'San José', description: 'Abrigo largo gris.', datePosted: '2024-02-10', likes: 4 },
    { id: 8, name: 'Zapatos casual cuero', category: 'hombre', price: 85000, icon: 'footsteps', sellerId: 2, size: '42', color: 'Marrón', brand: 'Camper', condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Heredia', description: 'Zapatos Camper de cuero.', datePosted: '2024-04-10', likes: 6 },
    { id: 9, name: 'Sombrero tejido', category: 'accesorios', price: 25000, icon: 'hiking', sellerId: 3, size: 'Único', color: 'Beige', brand: 'El Corte Inglés', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'Alajuela', description: 'Sombrero de paja tejido.', datePosted: '2024-06-15', likes: 2 },
    { id: 10, name: 'Jeans pitillo negro', category: 'mujer', price: 50000, icon: 'checkroom', sellerId: 3, size: '36', color: 'Negro', brand: 'Pull&Bear', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'Alajuela', description: 'Jeans pitillo negro.', datePosted: '2024-06-12', likes: 9 },
    { id: 11, name: 'Bufanda de lana', category: 'accesorios', price: 20000, icon: 'checkroom', sellerId: 1, size: 'Único', color: 'Rojo', brand: 'Zara', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'San José', description: 'Bufanda de lana roja.', datePosted: '2024-01-20', likes: 1 },
    { id: 12, name: 'Camiseta algodón básica', category: 'hombre', price: 25000, icon: 'shirt', sellerId: 2, size: 'L', color: 'Blanco', brand: 'Nike', condition: 'nuevo', gender: 'hombre', style: 'deportivo', location: 'Heredia', description: 'Camiseta Nike básica.', datePosted: '2024-06-08', likes: 3 },
  ]);
  write('carts', {});
  write('favorites', {});
  write('follows', {});
  write('messages', {});
}

// ===== AUTH =====
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const users = read('users');
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
  res.json({ token: String(user.id), user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body;
  const users = read('users');
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'El correo ya existe' });
  const newUser = { id: Date.now(), name, email, photo: 'person', description: '', rating: 0, salesCount: 0, followers: 0, following: 0, avgResponseTime: '—', joinDate: new Date().toISOString().split('T')[0] };
  users.push(newUser);
  write('users', users);
  res.json({ token: String(newUser.id), user: newUser });
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  req.userId = parseInt(token);
  next();
}

// ===== PRODUCTS =====
app.get('/api/products', (req, res) => {
  let list = [...read('products')];
  const { category, query, size, color, brand, condition, minPrice, maxPrice } = req.query;
  if (category && category !== 'todas') list = list.filter(p => p.category === category);
  if (query) { const q = query.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)); }
  if (size) list = list.filter(p => p.size === size);
  if (color) list = list.filter(p => p.color === color);
  if (brand) list = list.filter(p => p.brand === brand);
  if (condition) list = list.filter(p => p.condition === condition);
  if (minPrice) list = list.filter(p => p.price >= parseInt(minPrice));
  if (maxPrice) list = list.filter(p => p.price <= parseInt(maxPrice));
  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const p = read('products').find(x => x.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  res.json(p);
});

app.post('/api/products', auth, (req, res) => {
  const products = read('products');
  const { name, price, description, category, size, color, brand, condition, icon } = req.body;
  const newProduct = { id: Date.now(), name, price: parseInt(price), icon: icon || 'checkroom', sellerId: req.userId, size, color, brand, condition, gender: category === 'hombre' ? 'hombre' : 'mujer', style: 'casual', location: '', description, datePosted: new Date().toISOString().split('T')[0], likes: 0, category };
  products.push(newProduct);
  write('products', products);
  res.json(newProduct);
});

// ===== USERS =====
app.get('/api/users/:id', (req, res) => {
  const user = read('users').find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'No encontrado' });
  res.json(user);
});

// ===== CART =====
app.get('/api/cart', auth, (req, res) => {
  const carts = read('carts');
  res.json(carts[req.userId] || []);
});

app.post('/api/cart', auth, (req, res) => {
  const carts = read('carts');
  if (!carts[req.userId]) carts[req.userId] = [];
  const { productId } = req.body;
  if (carts[req.userId].some(i => i.id === productId)) return res.status(400).json({ error: 'Ya está en el carrito' });
  const product = read('products').find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  carts[req.userId].push({ id: product.id, name: product.name, icon: product.icon, effectivePrice: product.price });
  write('carts', carts);
  res.json(carts[req.userId]);
});

app.delete('/api/cart/:productId', auth, (req, res) => {
  const carts = read('carts');
  if (carts[req.userId]) carts[req.userId] = carts[req.userId].filter(i => i.id !== parseInt(req.params.productId));
  write('carts', carts);
  res.json(carts[req.userId] || []);
});

app.post('/api/cart/checkout', auth, (req, res) => {
  const carts = read('carts');
  carts[req.userId] = [];
  write('carts', carts);
  res.json({ ok: true });
});

// ===== FAVORITES =====
app.get('/api/favorites', auth, (req, res) => {
  const favs = read('favorites');
  res.json(favs[req.userId] || []);
});

app.post('/api/favorites/toggle', auth, (req, res) => {
  const favs = read('favorites');
  if (!favs[req.userId]) favs[req.userId] = [];
  const { productId } = req.body;
  const idx = favs[req.userId].indexOf(productId);
  if (idx >= 0) favs[req.userId].splice(idx, 1);
  else favs[req.userId].push(productId);
  write('favorites', favs);
  res.json(favs[req.userId]);
});

// ===== FOLLOWS =====
app.get('/api/follows', auth, (req, res) => {
  const follows = read('follows');
  res.json(follows[req.userId] || []);
});

app.post('/api/follows/toggle', auth, (req, res) => {
  const follows = read('follows');
  if (!follows[req.userId]) follows[req.userId] = [];
  const { sellerId } = req.body;
  const idx = follows[req.userId].indexOf(sellerId);
  if (idx >= 0) follows[req.userId].splice(idx, 1);
  else follows[req.userId].push(sellerId);
  write('follows', follows);
  res.json(follows[req.userId]);
});

// ===== MESSAGES =====
app.get('/api/messages', auth, (req, res) => {
  const all = read('messages');
  const convs = {};
  Object.keys(all).forEach(key => {
    const ids = key.split('-').map(Number);
    if (ids.includes(req.userId)) convs[key] = all[key];
  });
  res.json(convs);
});

app.get('/api/messages/:convId', auth, (req, res) => {
  const all = read('messages');
  res.json(all[req.params.convId] || []);
});

app.post('/api/messages/:convId', auth, (req, res) => {
  const all = read('messages');
  if (!all[req.params.convId]) all[req.params.convId] = [];
  const { text } = req.body;
  all[req.params.convId].push({ from: req.userId, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  write('messages', all);
  res.json(all[req.params.convId]);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`LOOK API running on http://localhost:${PORT}`));
