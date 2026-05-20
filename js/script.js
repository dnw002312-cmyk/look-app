/* ============================================
   LOOK — Supabase direct client
   ============================================ */

const SUPABASE_URL = 'https://dbsoyafdebycalaakdlz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRic295YWZkZWJ5Y2FsYWFrZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODA4NDUsImV4cCI6MjA5NDg1Njg0NX0.a_ATmjgMO_P8pEcnMtK-zWuIja3ukGmVC2z7_3zMqyA';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function supadata(promise) {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data;
}

function formatPrice(n) { return '\u20A1' + Number(n).toLocaleString('es-CR'); }

function mapUser(u) {
  if (!u) return u;
  return { ...u, salesCount: u.sales_count ?? u.salesCount ?? 0, avgResponseTime: u.avg_response_time ?? u.avgResponseTime ?? '—', joinDate: u.join_date ?? u.joinDate ?? '' };
}

// ===== FALLBACK DATA =====
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
let currentChatId = null;

// ===== DOM HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== DATA LOADING =====
async function loadInitialData() {
  try {
    const [productsData, cartData, favsData, followsData, msgsData] = await Promise.all([
      supadata(sb.from('products').select('*').order('date_posted', { ascending: false })).catch(() => null),
      currentUser ? supadata(sb.from('carts').select('product_id, name, icon, effective_price').eq('user_id', currentUser.id)).catch(() => []) : Promise.resolve([]),
      currentUser ? supadata(sb.from('favorites').select('product_id').eq('user_id', currentUser.id)).catch(() => []) : Promise.resolve([]),
      currentUser ? supadata(sb.from('follows').select('seller_id').eq('user_id', currentUser.id)).catch(() => []) : Promise.resolve([]),
      currentUser ? supadata(sb.from('messages').select('*').or(`conv_id.ilike.%-${currentUser.id},conv_id.ilike.${currentUser.id}-%`)).catch(() => []) : Promise.resolve([]),
    ]);

    if (productsData) products = productsData.map(p => ({
      id: p.id, name: p.name, category: p.category, price: p.price, icon: p.icon,
      sellerId: p.seller_id, size: p.size, color: p.color, brand: p.brand,
      condition: p.condition, gender: p.gender, style: p.style, location: p.location,
      description: p.description, datePosted: p.date_posted, likes: p.likes
    }));
    cart = (cartData || []).map(i => ({ id: i.product_id, name: i.name, icon: i.icon, effectivePrice: i.effective_price }));
    favoriteIds = new Set((favsData || []).map(i => i.product_id));
    followingIds = new Set((followsData || []).map(i => i.seller_id));

    const convs = {};
    for (const msg of msgsData || []) {
      if (!convs[msg.conv_id]) convs[msg.conv_id] = [];
      convs[msg.conv_id].push({ from: msg.from_user, text: msg.text, time: msg.time });
    }
    messages = convs;

    renderCart();
    if (document.getElementById('productsContainer')) renderProducts();
    if (document.getElementById('favoritesContainer')) renderFavorites();
  } catch (e) {
    console.warn('Error loading data:', e.message);
  }
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
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: user } = await sb.from('users').select('*').eq('supabase_uid', data.user.id).single();
    if (!user) throw new Error('Perfil no encontrado');
    currentUser = mapUser(user);
    localStorage.setItem('look_user', JSON.stringify(currentUser));
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
  const pass = $$('#registerForm input[type="password"]')[0].value;
  const confirm = $$('#registerForm input[type="password"]')[1].value;
  if (pass !== confirm) { showFormError('#registerForm', 'Las contraseñas no coinciden'); return; }
  try {
    const { data, error } = await sb.auth.signUp({ email, password: pass });
    if (error) throw error;
    const { data: newUser, error: insertErr } = await sb.from('users').insert({
      name, email, photo: 'person', supabase_uid: data.user.id,
      join_date: new Date().toISOString().split('T')[0]
    }).select().single();
    if (insertErr) throw insertErr;
    currentUser = mapUser(newUser);
    localStorage.setItem('look_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuth();
    await loadInitialData();
  } catch (err) {
    showFormError('#registerForm', err.message);
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('look_user');
  sb.auth.signOut();
  updateAuthUI();
  location.reload();
}

function handleProfileSubmit(e) {
  e.preventDefault();
  if (!currentUser) { openAuth(); return; }
  const name = $('#profileName')?.value?.trim();
  const email = $('#profileEmail')?.value?.trim();
  const description = $('#profileDesc')?.value?.trim();
  const photo = document.querySelector('input[name="photo"]:checked')?.value;

  let valid = true;
  const showErr = (id, msg) => { const el = $(id)?.nextElementSibling; if (el) { el.textContent = msg; setTimeout(() => el.textContent = '', 3000); } };
  if (!name) { showErr('#profileName', 'El nombre es obligatorio'); valid = false; }
  if (!email) { showErr('#profileEmail', 'El correo es obligatorio'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('#profileEmail', 'Correo no válido'); valid = false; }
  if (!valid) return;
  saveProfile({ name, email, description, photo });
}

async function saveProfile(data) {
  if (!currentUser) return;
  try {
    const { data: updated, error } = await sb.from('users').update({
      name: data.name, email: data.email, description: data.description, photo: data.photo
    }).eq('id', currentUser.id).select().single();
    if (error) throw error;
    currentUser = mapUser(updated);
    localStorage.setItem('look_user', JSON.stringify(currentUser));
    updateAuthUI();
    const success = document.getElementById('profileSuccess');
    if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 3000); }
  } catch (err) {
    const errorEl = document.querySelector('#profileForm .form-error') || $('#profileForm .form-group:last-child .form-error');
    if (errorEl) { errorEl.textContent = err.message; setTimeout(() => errorEl.textContent = '', 3000); }
  }
}

function updateAuthUI() {
  const authBtn = $('#authBtn');
  if (!authBtn) return;
  if (currentUser) {
    authBtn.innerHTML = `<span class="material-icons-outlined">${currentUser.photo || 'person'}</span> ${currentUser.name.split(' ')[0]} <button class="btn btn--outline" id="logoutBtn" style="margin-left:8px">Cerrar sesión</button>`;
    authBtn.onclick = (e) => { if (!e.target.closest('#logoutBtn')) location.href = 'perfil.html'; };
    authBtn.style.cursor = 'pointer';
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
  const el = $('#categoriesContainer');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-filter="${cat.filter}">
      <div class="category-card__icon"><span class="material-icons-outlined">${cat.icon}</span></div>
      <div class="category-card__name">${cat.name}</div>
    </div>
  `).join('');
}

function getFilteredProducts() {
  let list = [...products];
  list = list.filter(p => currentFilter === 'todas' || p.category === currentFilter);
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
  const container = $('#productsContainer');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
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
    container.innerHTML = `<div class="section__desc" style="grid-column:1/-1;margin:40px 0;">No hay productos con esos criterios</div>`;
    return;
  }
  container.innerHTML = items.map(p => renderProductCard(p)).join('');
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
    const { data: existing } = await sb.from('favorites').select('product_id').eq('user_id', currentUser.id).eq('product_id', id);
    if (existing && existing.length > 0) {
      await sb.from('favorites').delete().eq('user_id', currentUser.id).eq('product_id', id);
      favoriteIds.delete(id);
    } else {
      await sb.from('favorites').insert({ user_id: currentUser.id, product_id: id });
      favoriteIds.add(id);
    }
  } catch (e) {
    if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  }
  renderProducts();
  renderFavorites();
  if ($('#productModal')?.classList.contains('open')) {
    $('#productDetailFav').innerHTML = favoriteIds.has(id) ? '<span class="material-icons-outlined" style="color:red">favorite</span> Quitar favorito' : '<span class="material-icons-outlined">favorite</span> Añadir favorito';
  }
}

// ===== FOLLOW =====
async function toggleFollow(sellerId) {
  if (!currentUser) { openAuth(); return; }
  try {
    const { data: existing } = await sb.from('follows').select('seller_id').eq('user_id', currentUser.id).eq('seller_id', sellerId);
    if (existing && existing.length > 0) {
      await sb.from('follows').delete().eq('user_id', currentUser.id).eq('seller_id', sellerId);
      followingIds.delete(sellerId);
    } else {
      await sb.from('follows').insert({ user_id: currentUser.id, seller_id: sellerId });
      followingIds.add(sellerId);
    }
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
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await sb.from('messages').insert({ conv_id: currentChatId, from_user: currentUser.id, text, time });
    if (!messages[currentChatId]) messages[currentChatId] = [];
    messages[currentChatId].push({ from: currentUser.id, text, time });
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
  $('#searchSection').style.display = searchMode ? 'block' : 'none';
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
    const { data: newProduct, error } = await sb.from('products').insert({
      name, category, price: parseInt(price), icon: iconList[category] || 'shirt',
      seller_id: currentUser.id, size, color, brand, condition,
      description: desc, date_posted: new Date().toISOString().split('T')[0]
    }).select().single();
    if (error) throw error;
    products.push({
      id: newProduct.id, name: newProduct.name, category: newProduct.category,
      price: newProduct.price, icon: newProduct.icon, sellerId: newProduct.seller_id,
      size: newProduct.size, color: newProduct.color, brand: newProduct.brand,
      condition: newProduct.condition, gender: newProduct.gender, style: newProduct.style,
      location: newProduct.location, description: newProduct.description,
      datePosted: newProduct.date_posted, likes: newProduct.likes
    });
  } catch (e) {
    console.warn('Upload failed:', e.message);
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

// ===== CART =====
async function addToCart(productId) {
  if (!requireAuth()) return;
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (cart.some(item => item.id === productId)) return;
  try {
    const { error } = await sb.from('carts').insert({
      user_id: currentUser.id, product_id: product.id,
      name: product.name, icon: product.icon, effective_price: product.price
    });
    if (error && error.code !== '23505') throw error;
    cart.push({ id: product.id, name: product.name, icon: product.icon, effectivePrice: product.price });
  } catch (e) {
    cart.push({ id: product.id, name: product.name, icon: product.icon, effectivePrice: product.price });
  }
  renderCart();
  renderProducts();
}

async function removeFromCart(id) {
  try {
    await sb.from('carts').delete().eq('user_id', currentUser.id).eq('product_id', id);
    cart = cart.filter(item => item.id !== id);
  } catch (e) {
    cart = cart.filter(item => item.id !== id);
  }
  renderCart();
  renderProducts();
}

function renderCart() {
  const body = $('#cartBody');
  const total = $('#cartTotal');
  const badge = $('#cartBadge');
  if (!body || !total) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
    total.textContent = '\u20A10';
    if (badge) badge.textContent = '0';
    return;
  }
  body.innerHTML = cart.map((item) => `
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
  const sum = cart.reduce((s, item) => s + item.effectivePrice, 0);
  total.textContent = formatPrice(sum);
  if (badge) badge.textContent = cart.length;
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

// Profile form
document.addEventListener('submit', (e) => {
  if (e.target.id === 'profileForm') handleProfileSubmit(e);
});

// Filter tabs
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab || !document.getElementById('filterTabs')) return;
  document.getElementById('filterTabs').querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentFilter = tab.dataset.filter;
  renderProducts();
});

// Hamburger menu
document.addEventListener('click', (e) => {
  if (e.target.closest('#hamburger')) document.getElementById('nav')?.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (e.target.closest('.nav__link')) document.getElementById('nav')?.classList.remove('open');
});

// Contact form
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'contactForm') return;
  e.preventDefault();
  let valid = true;
  const name = $('#formName');
  const email = $('#formEmail');
  const message = $('#formMessage');
  e.target.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  e.target.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  if (!name.value.trim()) { name.classList.add('error'); name.nextElementSibling.textContent = 'El nombre es obligatorio'; valid = false; }
  if (!email.value.trim()) { email.classList.add('error'); email.nextElementSibling.textContent = 'El correo es obligatorio'; valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('error'); email.nextElementSibling.textContent = 'Correo no válido'; valid = false; }
  if (!message.value.trim()) { message.classList.add('error'); message.nextElementSibling.textContent = 'El mensaje no puede estar vacío'; valid = false; }
  if (!valid) return;
  e.target.reset();
  const success = $('#contactSuccess');
  if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 4000); }
});

// Cart open/close
document.addEventListener('click', (e) => {
  if (e.target.closest('#cartBtn')) {
    if (!requireAuth()) return;
    document.getElementById('cartSidebar')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
  }
});
document.addEventListener('click', (e) => {
  if (e.target.closest('#cartClose') || e.target.closest('#cartOverlay')) {
    document.getElementById('cartSidebar')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
  }
});

// Checkout
document.addEventListener('click', (e) => {
  if (!e.target.closest('#checkoutBtn')) return;
  if (cart.length === 0) return;
  sb.from('carts').delete().eq('user_id', currentUser.id).catch(() => {});
  cart = [];
  renderCart();
  renderProducts();
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  alert('¡Compra realizada con éxito! Recibirás un correo con los detalles.');
});

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
// Upload btn
document.addEventListener('click', (e) => {
  if (e.target.closest('#uploadBtn')) openUpload();
});

// Upload image area click
document.addEventListener('click', (e) => {
  if (e.target.closest('#uploadImageArea')) $('#uploadImage').click();
});

// ===== INIT =====
async function initSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    const { data: user } = await sb.from('users').select('*').eq('supabase_uid', session.user.id).single();
    if (user) {
      currentUser = mapUser(user);
      localStorage.setItem('look_user', JSON.stringify(currentUser));
    }
  }
}

async function initPage() {
  currentUser = JSON.parse(localStorage.getItem('look_user')) || null;
  await initSession();
  updateAuthUI();
  loadInitialData();
}
