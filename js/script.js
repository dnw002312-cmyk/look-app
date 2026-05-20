/* ============================================
   LOOK — Compra y venta de ropa (JS)
   API-backed version
   ============================================ */

// Cambiar esta URL cuando hagas deploy a Railway
// Ej: const API = 'https://look-backend.up.railway.app/api';
const API = 'http://localhost:3001/api';

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('look_token');
  if (token) headers['Authorization'] = token;
  const res = await fetch(API + path, { ...options, headers });
  if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
  return res.json();
}

function formatPrice(n) { return '\u20A1' + Number(n).toLocaleString('es-CR'); }

// ===== SEED / FALLBACK DATA =====
const USERS = [
  { id: 1, name: 'María García', email: 'maria@email.com', photo: 'woman', description: 'Amante de la moda circular. Vendo prendas que ya no uso pero están en perfecto estado.', rating: 4.8, salesCount: 23, followers: 45, following: 12, avgResponseTime: '2h', joinDate: '2024-01-15' },
  { id: 2, name: 'Carlos López', email: 'carlos@email.com', photo: 'man', description: 'Ropa de marca a buen precio. Todo original.', rating: 4.5, salesCount: 15, followers: 28, following: 8, avgResponseTime: '1h', joinDate: '2024-03-20' },
  { id: 3, name: 'Ana Martínez', email: 'ana@email.com', photo: 'woman', description: 'Vintage lover. Prendas únicas y sostenibles.', rating: 4.9, salesCount: 31, followers: 67, following: 22, avgResponseTime: '3h', joinDate: '2023-11-05' },
];

const PRODUCTS_DATA = [
  { id: 1, name: 'Vestido floral verano', category: 'mujer', price: 45, icon: 'skirt', sellerId: 1, size: 'M', color: 'Multicolor', brand: 'Zara', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'Madrid', description: 'Vestido floral perfecto para el verano. Tejido ligero y fresco. Solo se ha usado una vez.', datePosted: '2024-06-01', likes: 12 },
  { id: 2, name: 'Chaqueta de cuero', category: 'hombre', price: 120, icon: 'checkroom', sellerId: 2, size: 'L', color: 'Negro', brand: "Levi's", condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Barcelona', description: 'Chaqueta de cuero auténtica. Excelente estado, como nueva.', datePosted: '2024-05-15', likes: 8 },
  { id: 3, name: 'Bolso tote bag', category: 'accesorios', price: 60, icon: 'handbag', sellerId: 1, size: 'Único', color: 'Marrón', brand: 'Mango', condition: 'nuevo', gender: 'mujer', style: 'elegante', location: 'Madrid', description: 'Bolso tote bag de Mango. Capacidad grande, ideal para el día a día.', datePosted: '2024-06-10', likes: 5 },
  { id: 4, name: 'Camisa lino blanca', category: 'hombre', price: 55, icon: 'shirt', sellerId: 2, size: 'M', color: 'Blanco', brand: 'Massimo Dutti', condition: 'como nuevo', gender: 'hombre', style: 'formal', location: 'Barcelona', description: 'Camisa de lino blanca, perfecta para el verano.', datePosted: '2024-04-20', likes: 3 },
  { id: 5, name: 'Falda plisada', category: 'mujer', price: 40, icon: 'skirt', sellerId: 3, size: 'S', color: 'Azul', brand: 'H&M', condition: 'usado', gender: 'mujer', style: 'casual', location: 'Valencia', description: 'Falda plisada azul. Muy cómoda y combinable.', datePosted: '2024-06-05', likes: 7 },
  { id: 6, name: 'Gafas de sol aviador', category: 'accesorios', price: 35, icon: 'sunglasses', sellerId: 3, size: 'Único', color: 'Dorado', brand: 'Ray-Ban', condition: 'como nuevo', gender: 'unisex', style: 'casual', location: 'Valencia', description: 'Gafas aviador clásicas. Incluyen estuche original.', datePosted: '2024-05-01', likes: 15 },
  { id: 7, name: 'Abrigo invernal largo', category: 'mujer', price: 150, icon: 'checkroom', sellerId: 1, size: 'L', color: 'Gris', brand: 'Stradivarius', condition: 'poco uso', gender: 'mujer', style: 'elegante', location: 'Madrid', description: 'Abrigo largo gris. Perfecto para el invierno.', datePosted: '2024-02-10', likes: 4 },
  { id: 8, name: 'Zapatos casual cuero', category: 'hombre', price: 85, icon: 'footsteps', sellerId: 2, size: '42', color: 'Marrón', brand: 'Camper', condition: 'poco uso', gender: 'hombre', style: 'casual', location: 'Barcelona', description: 'Zapatos Camper de cuero. Muy cómodos.', datePosted: '2024-04-10', likes: 6 },
  { id: 9, name: 'Sombrero tejido', category: 'accesorios', price: 25, icon: 'hiking', sellerId: 3, size: 'Único', color: 'Beige', brand: 'El Corte Inglés', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'Valencia', description: 'Sombrero de paja tejido. Protección solar.', datePosted: '2024-06-15', likes: 2 },
  { id: 10, name: 'Jeans pitillo negro', category: 'mujer', price: 50, icon: 'checkroom', sellerId: 3, size: '36', color: 'Negro', brand: 'Pull&Bear', condition: 'nuevo', gender: 'mujer', style: 'casual', location: 'Valencia', description: 'Jeans pitillo negro. Elásticos y cómodos.', datePosted: '2024-06-12', likes: 9 },
  { id: 11, name: 'Bufanda de lana', category: 'accesorios', price: 20, icon: 'checkroom', sellerId: 1, size: 'Único', color: 'Rojo', brand: 'Zara', condition: 'nuevo', gender: 'unisex', style: 'casual', location: 'Madrid', description: 'Bufanda de lana roja. Suave y cálida.', datePosted: '2024-01-20', likes: 1 },
  { id: 12, name: 'Camiseta algodón básica', category: 'hombre', price: 25, icon: 'shirt', sellerId: 2, size: 'L', color: 'Blanco', brand: 'Nike', condition: 'nuevo', gender: 'hombre', style: 'deportivo', location: 'Barcelona', description: 'Camiseta Nike básica. Algodón 100%.', datePosted: '2024-06-08', likes: 3 },
];

const CATEGORIES = [
  { name: 'Mujer', icon: 'woman', filter: 'mujer' },
  { name: 'Hombre', icon: 'man', filter: 'hombre' },
  { name: 'Accesorios', icon: 'watch', filter: 'accesorios' },
  { name: 'Todos', icon: 'apps', filter: 'todas' },
];

// ===== STATE =====
let products = [...PRODUCTS_DATA.map(p => ({...p}))];
let currentUser = JSON.parse(localStorage.getItem('look_user')) || null;
let cart = [];
let currentFilter = 'todas';
let favoriteIds = new Set();
let followingIds = new Set();
let messages = {};
let searchMode = false;
let currentView = 'catalogo';
let currentChatId = null;

// ===== DOM REFS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const productsContainer = $('#productsContainer');
const categoriesContainer = $('#categoriesContainer');
const filterTabs = $('#filterTabs');
const cartBtn = $('#cartBtn');
const cartBadge = $('#cartBadge');
const cartSidebar = $('#cartSidebar');
const cartOverlay = $('#cartOverlay');
const cartClose = $('#cartClose');
const cartBody = $('#cartBody');
const cartTotal = $('#cartTotal');
const checkoutBtn = $('#checkoutBtn');
const themeToggle = $('#themeToggle');
const hamburger = $('#hamburger');
const nav = $('#nav');
const contactForm = $('#contactForm');
const contactSuccess = $('#contactSuccess');

// ===== DATA LOADING =====
async function loadInitialData() {
  try {
    const [prods, cartData, favs, follows, msgs] = await Promise.all([
      api('/products').catch(() => products),
      api('/cart').catch(() => cart),
      api('/favorites').catch(() => []),
      api('/follows').catch(() => []),
      api('/messages').catch(() => ({})),
    ]);
    products = prods;
    cart = Array.isArray(cartData) ? cartData : [];
    favoriteIds = new Set(favs);
    followingIds = new Set(follows);
    messages = msgs;
  } catch (e) {
    console.warn('API unavailable, using seed data');
  }
  renderProducts();
  renderCart();
}

// ===== AUTH =====
function openAuth() {
  if (currentUser) return;
  $('#authModal').classList.add('open');
}

function closeAuth() {
  $('#authModal').classList.remove('open');
}

function switchAuthTab(tab) {
  $$('.auth-tab').forEach(t => t.classList.remove('active'));
  $(`.auth-tab[data-auth="${tab}"]`).classList.add('active');
  $('#loginForm').style.display = tab === 'login' ? '' : 'none';
  $('#registerForm').style.display = tab === 'register' ? '' : 'none';
  $('#authModalTitle').textContent = tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
}

async function handleLogin(e) {
  e.preventDefault();
  const email = $('#loginForm input[type="email"]').value;
  const password = $('#loginForm input[type="password"]').value;
  try {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('look_token', data.token);
    localStorage.setItem('look_user', JSON.stringify(data.user));
    currentUser = data.user;
    updateAuthUI();
    closeAuth();
    await loadInitialData();
  } catch (err) {
    showFormError('#loginForm', err.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = $('#registerForm input[type="text"]').value;
  const email = $('#registerForm input[type="email"]').value;
  const pass = $('#registerForm input[type="password"]').value;
  const confirm = $$('#registerForm input[type="password"]')[1].value;
  if (pass !== confirm) { showFormError('#registerForm', 'Las contraseñas no coinciden'); return; }
  try {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password: pass }) });
    localStorage.setItem('look_token', data.token);
    localStorage.setItem('look_user', JSON.stringify(data.user));
    currentUser = data.user;
    updateAuthUI();
    closeAuth();
    await loadInitialData();
  } catch (err) {
    showFormError('#registerForm', err.message);
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('look_token');
  localStorage.removeItem('look_user');
  updateAuthUI();
  location.reload();
}

function updateAuthUI() {
  const authBtn = $('#authBtn');
  if (!authBtn) return;
  if (currentUser) {
    authBtn.innerHTML = `<span class="material-icons-outlined">${currentUser.photo || 'person'}</span> ${currentUser.name.split(' ')[0]} <button class="btn btn--outline" id="logoutBtn" style="margin-left:8px">Cerrar sesión</button>`;
    authBtn.onclick = null;
  } else {
    authBtn.innerHTML = '<span class="material-icons-outlined">person</span> Iniciar sesión';
    authBtn.onclick = openAuth;
  }
}

function showFormError(formId, msg) {
  const err = document.querySelector(`${formId} .form-error`);
  if (err) { err.textContent = msg; setTimeout(() => err.textContent = '', 3000); }
}

// ===== MODALS =====
function openModal(id) { $(`#${id}`).classList.add('open'); }
function closeModal(id) { $(`#${id}`).classList.remove('open'); }

// ===== PRODUCTS RENDER =====
function renderCategories() {
  if (!categoriesContainer) return;
  categoriesContainer.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-filter="${cat.filter}">
      <div class="category-card__icon"><span class="material-icons-outlined">${cat.icon}</span></div>
      <div class="category-card__name">${cat.name}</div>
    </div>
  `).join('');
}

function getFilteredProducts() {
  let list = [...products];
  if (currentView === 'favoritos') {
    list = list.filter(p => favoriteIds.has(p.id));
  } else {
    list = list.filter(p => currentFilter === 'todas' || p.category === currentFilter);
  }
  if (searchMode) {
    const q = ($('#searchInput')?.value || '').toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    const sz = [...document.querySelectorAll('#filterSize input:checked')].map(c => c.value);
    if (sz.length) list = list.filter(p => sz.includes(p.size));
    const col = [...document.querySelectorAll('#filterColor input:checked')].map(c => c.value);
    if (col.length) list = list.filter(p => col.includes(p.color));
    const br = [...document.querySelectorAll('#filterBrand input:checked')].map(c => c.value);
    if (br.length) list = list.filter(p => br.includes(p.brand));
    const cond = [...document.querySelectorAll('#filterCondition input:checked')].map(c => c.value);
    if (cond.length) list = list.filter(p => cond.includes(p.condition));
    const min = parseFloat($('#filterPriceMin')?.value);
    const max = parseFloat($('#filterPriceMax')?.value);
    if (min) list = list.filter(p => p.price >= min);
    if (max) list = list.filter(p => p.price <= max);
  }
  return list;
}

function requireAuth() { if (!currentUser) { openAuth(); return false; } return true; }

function renderProducts(list) {
  if (!productsContainer) return;

  if (!currentUser) {
    productsContainer.innerHTML = `
      <div class="auth-gate">
        <div class="auth-gate__content">
          <span class="material-icons-outlined auth-gate__icon">lock</span>
          <h3 class="auth-gate__title">Regístrate para ver los productos</h3>
          <p class="auth-gate__text">Crea una cuenta o inicia sesión para explorar, comprar y vender ropa en LOOK.</p>
          <div class="auth-gate__actions">
            <button class="btn btn--primary" onclick="openAuth()">Crear cuenta</button>
            <button class="btn btn--outline" onclick="openAuth()">Ya tengo cuenta</button>
          </div>
        </div>
      </div>`;
    return;
  }

  const items = list || getFilteredProducts();
  if (items.length === 0) {
    productsContainer.innerHTML = `<div class="section__desc" style="grid-column:1/-1;margin:40px 0;">No hay productos con esos criterios</div>`;
    return;
  }
  productsContainer.innerHTML = items.map(p => renderProductCard(p)).join('');
}

function renderProductCard(p) {
  const inCart = cart.some(item => item.id === p.id);
  const isFav = favoriteIds.has(p.id);
  const seller = USERS.find(u => u.id === p.sellerId);
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__image" data-open-product="${p.id}" style="cursor:pointer">
        <span class="product-card__badge badge--sale">Venta</span>
        <span class="material-icons-outlined" style="font-size:48px">${p.icon || 'checkroom'}</span>
        <button class="product-card__fav ${isFav ? 'fav-active' : ''}" data-toggle-fav="${p.id}">${isFav ? '<span class="material-icons-outlined" style="color:red">favorite</span>' : '<span class="material-icons-outlined">favorite</span>'}</button>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${p.category}</div>
        <div class="product-card__title" data-open-product="${p.id}" style="cursor:pointer">${p.name}</div>
        <div class="product-card__meta">
          <span>${p.size || ''} ${p.color ? '· '+p.color : ''}</span>
          <span>${p.condition || ''}</span>
        </div>
        <div class="product-card__prices">
          <span class="product-card__price">${formatPrice(p.price)}</span>
        </div>
        <div class="product-card__seller" data-open-seller="${p.sellerId}" style="cursor:pointer">
          ${seller ? `<span class="material-icons-outlined">${seller.photo}</span> ${seller.name}` : '<span class="material-icons-outlined">person</span> Vendedor'}
        </div>
        <button class="product-card__add" data-id="${p.id}">
          ${inCart ? '✓ En carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  `;
}

function renderFavorites() {
  const container = $('#favoritesContainer');
  if (!container) return;
  const favs = products.filter(p => favoriteIds.has(p.id));
  if (favs.length === 0) {
    container.innerHTML = '<div class="section__desc" style="grid-column:1/-1">No tienes favoritos aún. Explora el catálogo y guarda lo que te guste.</div>';
  } else {
    container.innerHTML = favs.map(p => renderProductCard(p)).join('');
  }
}

// ===== PRODUCT DETAIL =====
function openProductDetail(id) {
  if (!requireAuth()) return;
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  const seller = USERS.find(u => u.id === p.sellerId);
  $('#productDetailImage').innerHTML = `<span class="material-icons-outlined" style="font-size:48px">${p.icon || 'checkroom'}</span>`;
  $('#productDetailName').textContent = p.name;
  $('#productDetailPrice').textContent = formatPrice(p.price);
  $('#productDetailSize').textContent = p.size || '—';
  $('#productDetailColor').textContent = p.color || '—';
  $('#productDetailBrand').textContent = p.brand || '—';
  $('#productDetailCondition').textContent = p.condition || '—';
  $('#productDetailDesc').textContent = p.description || '';
  $('#productDetailSellerName').textContent = seller ? seller.name : 'Vendedor';
  $('#productDetailSellerRating').textContent = seller ? '★'.repeat(Math.round(seller.rating)) + '☆'.repeat(5 - Math.round(seller.rating)) : '★★★★★';
  $('#productDetailSeller').onclick = () => { closeModal('productModal'); openSellerProfile(p.sellerId); };
  $('#productDetailSeller').style.cursor = 'pointer';
  $('#productDetailAddCart').onclick = () => { addToCart(p.id); closeModal('productModal'); };
  $('#productDetailFav').onclick = () => { toggleFavorite(p.id); };
  $('#productDetailFav').innerHTML = favoriteIds.has(p.id) ? '<span class="material-icons-outlined" style="color:red">favorite</span> Quitar favorito' : '<span class="material-icons-outlined">favorite</span> Añadir favorito';
  $('#productDetailChat').onclick = () => { closeModal('productModal'); openChat(p.sellerId, p.id); };
  openModal('productModal');
}

// ===== FAVORITES =====
async function toggleFavorite(id) {
  if (!requireAuth()) return;
  try {
    await api('/favorites/toggle', { method: 'POST', body: JSON.stringify({ productId: id }) });
    favoriteIds = new Set(await api('/favorites'));
  } catch (e) {
    if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  }
  renderProducts();
  renderFavorites();
  if ($('#productModal')?.classList.contains('open')) {
    const p = products.find(pr => pr.id === id);
    if (p) { $('#productDetailFav').innerHTML = favoriteIds.has(id) ? '<span class="material-icons-outlined" style="color:red">favorite</span> Quitar favorito' : '<span class="material-icons-outlined">favorite</span> Añadir favorito'; }
  }
}

// ===== FOLLOW =====
async function toggleFollow(sellerId) {
  if (!currentUser) { openAuth(); return; }
  try {
    await api('/follows/toggle', { method: 'POST', body: JSON.stringify({ sellerId }) });
    followingIds = new Set(await api('/follows'));
  } catch (e) {
    if (followingIds.has(sellerId)) followingIds.delete(sellerId); else followingIds.add(sellerId);
  }
  renderSellerProfile(sellerId);
}

function isFollowing(sellerId) { return followingIds.has(sellerId); }

// ===== SELLER PROFILE =====
function openSellerProfile(sellerId) {
  renderSellerProfile(sellerId);
  openModal('sellerModal');
}

function renderSellerProfile(sellerId) {
  const seller = USERS.find(u => u.id === sellerId);
  if (!seller) return;
  const sellerProds = products.filter(p => p.sellerId === sellerId);
  $('#sellerProfileName').textContent = seller.name;
  $('#sellerProfileAvatar').innerHTML = `<span class="material-icons-outlined">${seller.photo || 'person'}</span>`;
  $('#sellerProfileAvatar').style.fontSize = '3rem';
  $('#sellerProfileRating').textContent = '★'.repeat(Math.round(seller.rating)) + '☆'.repeat(5 - Math.round(seller.rating));
  $('#sellerProfileJoined').textContent = `Miembro desde ${seller.joinDate?.split('-')[0] || '2024'}`;
  $('#sellerProfileProducts').textContent = sellerProds.length;
  $('#sellerProfileSales').textContent = seller.salesCount || 0;
  $('#sellerProfileRatingNum').textContent = seller.rating || 0;
  $('#sellerProfileBio').innerHTML = `<p>${seller.description || 'Sin descripción.'}</p>`;
  const btnHtml = currentUser && currentUser.id !== sellerId
    ? `<button class="btn ${isFollowing(sellerId) ? 'btn--outline' : 'btn--primary'}" data-follow="${sellerId}">${isFollowing(sellerId) ? '✓ Siguiendo' : '<span class="material-icons-outlined">add_circle</span> Seguir'}</button>
       <button class="btn btn--outline" data-chat-seller="${sellerId}"><span class="material-icons-outlined">chat</span> Contactar</button>`
    : '';
  $('#sellerProfileBio').innerHTML += `<div class="seller-profile__actions">${btnHtml}</div>`;
  $('#sellerProducts').innerHTML = sellerProds.length
    ? sellerProds.map(p => renderProductCard(p)).join('')
    : '<p>Este vendedor aún no tiene productos.</p>';
}

// ===== CHAT =====
function getConvId(a, b) { return [a, b].sort().join('-'); }

function openChat(sellerId, productId) {
  if (!currentUser) { openAuth(); return; }
  if (sellerId) {
    currentChatId = getConvId(currentUser.id, sellerId);
    if (!messages[currentChatId]) messages[currentChatId] = [];
    const partner = USERS.find(u => u.id === sellerId);
    $('#chatViewHeader').innerHTML = `<span class="chat__view-name"><span class="material-icons-outlined">${partner.photo}</span> ${partner.name}</span>`;
    renderChatMessages();
    $('#chatInput').disabled = false;
    $('#chatSend').disabled = false;
  }
  renderChatList();
  openModal('chatModal');
}

function renderChatList() {
  const container = $('#chatConversations');
  if (!container) return;
  const convs = {};
  Object.keys(messages).forEach(key => {
    const ids = key.split('-').map(Number);
    if (currentUser && (ids[0] === currentUser.id || ids[1] === currentUser.id)) {
      const partnerId = ids[0] === currentUser.id ? ids[1] : ids[0];
      const partner = USERS.find(u => u.id === partnerId);
      const lastMsg = messages[key][messages[key].length - 1];
      convs[key] = { partner, lastMsg, unread: 0 };
    }
  });
  container.innerHTML = Object.keys(convs).length === 0
    ? '<div class="chat__empty">No tienes conversaciones</div>'
    : Object.entries(convs).map(([key, conv]) => `
      <div class="chat__conv-item ${key === currentChatId ? 'active' : ''}" data-chat-conv="${key}">
        <span class="chat__conv-avatar"><span class="material-icons-outlined">${conv.partner?.photo || 'person'}</span></span>
        <div class="chat__conv-info">
          <strong>${conv.partner?.name || 'Usuario'}</strong>
          <span>${conv.lastMsg?.text?.substring(0, 30) || ''}</span>
        </div>
      </div>
    `).join('');
}

function renderChatMessages() {
  const container = $('#chatMessages');
  if (!container || !currentChatId || !messages[currentChatId]) {
    container.innerHTML = '<div class="chat__empty">Selecciona un chat</div>';
    return;
  }
  container.innerHTML = messages[currentChatId].map(m => `
    <div class="chat__msg ${m.from === currentUser?.id ? 'chat__msg--own' : ''}">
      <div class="chat__msg-text">${m.text}</div>
      <div class="chat__msg-time">${m.time || ''}</div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = $('#chatInput');
  const text = input.value.trim();
  if (!text || !currentChatId || !currentUser) return;
  try {
    await api('/messages/' + currentChatId, { method: 'POST', body: JSON.stringify({ text }) });
    messages = await api('/messages');
  } catch (e) {
    if (!messages[currentChatId]) messages[currentChatId] = [];
    messages[currentChatId].push({ from: currentUser.id, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }
  input.value = '';
  renderChatMessages();
  renderChatList();
}

// ===== SEARCH =====
function toggleSearch() {
  searchMode = !searchMode;
  $('#searchSection').style.display = searchMode ? '' : 'none';
  if (!searchMode) { clearFilters(); }
}

function applyFilters() {
  renderProducts();
}

function clearFilters() {
  $('#searchInput').value = '';
  $$('#searchFilters input[type="checkbox"]').forEach(c => c.checked = false);
  $('#filterPriceMin').value = '';
  $('#filterPriceMax').value = '';
  renderProducts();
}

// ===== UPLOAD =====
function openUpload() {
  if (!currentUser) { openAuth(); return; }
  $('#uploadForm').reset();
  openModal('uploadModal');
}

async function handleUpload(e) {
  e.preventDefault();
  if (!currentUser) return;
  const name = $('#uploadName').value.trim();
  const price = parseFloat($('#uploadPrice').value);
  const desc = $('#uploadDesc').value.trim();
  const category = $('#uploadCategory').value;
  const size = $('#uploadSize').value;
  const color = $('#uploadColor').value;
  const brand = $('#uploadBrand').value.trim();
  const condition = document.querySelector('input[name="condition"]:checked')?.value || 'nuevo';
  if (!name || !price || !category) return;
  const iconList = { mujer: 'skirt', hombre: 'shirt', accesorios: 'sunglasses' };
  try {
    const body = { name, price, description: desc, category, size, color, brand, condition, icon: iconList[category] || 'shirt', sellerId: currentUser.id };
    await api('/products', { method: 'POST', body: JSON.stringify(body) });
    products = await api('/products');
  } catch (e) {
    console.warn('Upload failed, adding locally');
    const newProduct = {
      id: Date.now(), name, category, price, icon: iconList[category] || 'shirt',
      sellerId: currentUser.id, size, color, brand, condition,
      gender: category === 'hombre' ? 'hombre' : category === 'mujer' ? 'mujer' : 'unisex',
      style: 'casual', location: '', description: desc,
      datePosted: new Date().toISOString().split('T')[0], likes: 0
    };
    products.push(newProduct);
  }
  closeModal('uploadModal');
  renderProducts();
}

// ===== NAVIGATION =====
function showView(view) {
  if (view === 'favoritos' && !requireAuth()) return;
  currentView = view;
  const catalogSection = $('#catalogo');
  const favSection = $('#favorites');
  if (view === 'favoritos') {
    catalogSection.style.display = 'none';
    favSection.style.display = '';
    renderFavorites();
  } else {
    catalogSection.style.display = '';
    favSection.style.display = 'none';
    renderProducts();
  }
  $$('.nav__link').forEach(l => l.classList.toggle('active', l.dataset.view === view));
}

// ===== CART =====
async function addToCart(productId) {
  if (!requireAuth()) return;
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (cart.some(item => item.id === productId)) return;
  try {
    await api('/cart', { method: 'POST', body: JSON.stringify({ productId }) });
    cart = await api('/cart');
  } catch (e) {
    cart.push({ id: product.id, name: product.name, icon: product.icon, type: 'buy', effectivePrice: product.price });
  }
  renderCart();
  renderProducts();
}

async function removeFromCart(id) {
  try {
    await api('/cart/' + id, { method: 'DELETE' });
    cart = await api('/cart');
  } catch (e) {
    cart = cart.filter(item => item.id !== id);
  }
  renderCart();
  renderProducts();
}

function renderCart() {
  if (!cartBody || !cartTotal) return;
  if (cart.length === 0) {
    cartBody.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
    cartTotal.textContent = '\u20A10';
    cartBadge.textContent = '0';
    return;
  }
  cartBody.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item__image"><span class="material-icons-outlined" style="font-size:48px">${item.icon || 'checkroom'}</span></div>
      <div class="cart-item__info">
        <div class="cart-item__title">${item.name}</div>
        <div class="cart-item__type">Compra</div>
        <div class="cart-item__price">${formatPrice(item.effectivePrice)}</div>
        <button class="cart-item__remove" data-id="${item.id}">Eliminar</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.effectivePrice, 0);
  cartTotal.textContent = formatPrice(total);
  cartBadge.textContent = cart.length;
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
}

// ===== EVENTS =====
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-open-product]');
  if (target) { e.preventDefault(); openProductDetail(parseInt(target.dataset.openProduct)); }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-toggle-fav]');
  if (target) { e.preventDefault(); toggleFavorite(parseInt(target.dataset.toggleFav)); }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-open-seller]');
  if (target) { e.preventDefault(); openSellerProfile(parseInt(target.dataset.openSeller)); }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-follow]');
  if (target) { e.preventDefault(); toggleFollow(parseInt(target.dataset.follow)); }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-chat-seller]');
  if (target) { e.preventDefault(); openChat(parseInt(target.dataset.chatSeller)); }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-chat-conv]');
  if (target) {
    currentChatId = target.dataset.chatConv;
    const ids = currentChatId.split('-').map(Number);
    const partnerId = ids[0] === currentUser?.id ? ids[1] : ids[0];
    const partner = USERS.find(u => u.id === partnerId);
    $('#chatViewHeader').innerHTML = `<span class="chat__view-name"><span class="material-icons-outlined">${partner.photo}</span> ${partner.name}</span>`;
    renderChatMessages();
    $('#chatInput').disabled = false;
    $('#chatSend').disabled = false;
    renderChatList();
  }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-view]');
  if (target) { e.preventDefault(); showView(target.dataset.view); }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.product-card__add')) {
    const id = parseInt(e.target.closest('.product-card__add').dataset.id);
    addToCart(id);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.cart-item__remove')) {
    const id = parseInt(e.target.closest('.cart-item__remove').dataset.id);
    removeFromCart(id);
  }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('#logoutBtn');
  if (target) { e.preventDefault(); handleLogout(); }
});

// Modal close buttons
document.addEventListener('click', (e) => {
  const close = e.target.closest('.modal__close');
  if (close) {
    const modalId = close.dataset.modal;
    if (modalId) closeModal(modalId);
  }
});

// Modal overlay click to close
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Auth tabs
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.auth-tab');
  if (tab) switchAuthTab(tab.dataset.auth);
});

// Login form
document.addEventListener('submit', (e) => {
  if (e.target.id === 'loginForm') handleLogin(e);
});

// Register form
document.addEventListener('submit', (e) => {
  if (e.target.id === 'registerForm') handleRegister(e);
});

// Upload form
document.addEventListener('submit', (e) => {
  if (e.target.id === 'uploadForm') handleUpload(e);
});

// Filter tabs
if (filterTabs) {
  filterTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    showView('catalogo');
    renderProducts();
  });
}

// Hamburger menu
if (hamburger && nav) {
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

// Contact form
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = $('#formName');
    const email = $('#formEmail');
    const message = $('#formMessage');
    contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    if (!name.value.trim()) { name.classList.add('error'); name.nextElementSibling.textContent = 'El nombre es obligatorio'; valid = false; }
    if (!email.value.trim()) { email.classList.add('error'); email.nextElementSibling.textContent = 'El correo es obligatorio'; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('error'); email.nextElementSibling.textContent = 'Correo no válido'; valid = false; }
    if (!message.value.trim()) { message.classList.add('error'); message.nextElementSibling.textContent = 'El mensaje no puede estar vacío'; valid = false; }
    if (!valid) return;
    contactForm.reset();
    contactSuccess.style.display = 'block';
    setTimeout(() => contactSuccess.style.display = 'none', 4000);
  });
}

// Cart open/close
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    if (!requireAuth()) return;
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  });
}
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;
    alert('¡Compra realizada con éxito! Recibirás un correo con los detalles.');
    try { await api('/cart', { method: 'DELETE' }); } catch (e) {}
    cart = [];
    renderCart();
    renderProducts();
    closeCart();
  });
}

// Search
document.addEventListener('click', (e) => {
  if (e.target.closest('#searchSubmit')) applyFilters();
});
document.addEventListener('click', (e) => {
  if (e.target.closest('#searchClose')) toggleSearch();
});
document.addEventListener('click', (e) => {
  if (e.target.closest('#filterClear')) clearFilters();
});
document.addEventListener('click', (e) => {
  if (e.target.closest('#filterApply')) applyFilters();
});

// Chat send
document.addEventListener('click', (e) => {
  if (e.target.closest('#chatSend')) sendMessage();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'chatInput') sendMessage();
});

// Search toggle via header btn
document.addEventListener('click', (e) => {
  if (e.target.closest('#searchToggle')) { if (!requireAuth()) return; toggleSearch(); }
});
// Fav btn
document.addEventListener('click', (e) => {
  if (e.target.closest('#favBtn')) showView('favoritos');
});
// Upload btn
document.addEventListener('click', (e) => {
  if (e.target.closest('#uploadBtn')) openUpload();
});

// Upload image area click
document.addEventListener('click', (e) => {
  if (e.target.closest('#uploadImageArea')) $('#uploadImage').click();
});

// ===== INIT =====
renderCategories();
updateAuthUI();
loadInitialData();
