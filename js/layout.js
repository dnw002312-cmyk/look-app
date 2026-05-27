function renderLayout(pageTitle) {
  document.title = pageTitle + ' — LOOK';
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const body = document.body;
  body.innerHTML = `
    <!-- ===== HEADER ===== -->
    <header class="header">
      <div class="header__inner">
        <a href="index.html" class="logo">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 6 L46 6 C50 6 53 9 53 13 L53 52 C53 56 50 59 46 59 L18 59 C14 59 11 56 11 52 L11 17 C11 14.5 12 12.2 13.7 10.5 L18.5 5.7 C19.5 4.7 21 6 22 6 Z" fill="var(--ink)"/>
            <circle cx="18" cy="14" r="2.4" fill="var(--background)"/>
            <path d="M24 26 L28 23 L36 23 L40 26 L43 29 L40 32 L38 31 L38 44 C38 45 37 46 36 46 L28 46 C27 46 26 45 26 44 L26 31 L24 32 L21 29 Z M30 23 C30 25 31 26 32 26 C33 26 34 25 34 23" fill="var(--brand)" stroke="var(--brand)" stroke-width="0.6" stroke-linejoin="round"/>
          </svg>
          <span>LOOK<span style="color:var(--brand)">.</span></span>
        </a>

        <nav class="nav">
          <ul class="nav__list">
            <li><a href="catalogo.html" class="nav__link ${currentPath === 'catalogo.html' ? 'active' : ''}">Marketplace</a></li>
            <li><a href="favoritos.html" class="nav__link ${currentPath === 'favoritos.html' ? 'active' : ''}">Favoritos</a></li>
            <li><a href="perfil.html" class="nav__link ${currentPath === 'perfil.html' ? 'active' : ''}">Mi perfil</a></li>
            <li><a href="contacto.html" class="nav__link ${currentPath === 'contacto.html' ? 'active' : ''}">Contacto</a></li>
          </ul>
        </nav>

        <div class="header-search">
          <span class="material-icons-outlined">search</span>
          <input type="text" id="headerSearchInput" placeholder="Buscar ropa, marcas, tallas..." />
        </div>

        <div class="header__actions">
          <button class="header-icon-btn" id="searchToggle" aria-label="Buscar"><span class="material-icons-outlined">search</span></button>
          <button class="header-icon-btn" id="uploadBtn" aria-label="Vender"><span class="material-icons-outlined">add_circle_outline</span> Vender</button>
          <button class="cart-btn" id="cartBtn" aria-label="Carrito">
            <span class="material-icons-outlined">shopping_bag</span>
            <span class="cart-badge" id="cartBadge">0</span>
          </button>
          <button class="header-icon-btn" id="authBtn" aria-label="Iniciar sesión"><span class="material-icons-outlined">person_outline</span></button>
          <button class="hamburger" id="hamburger" aria-label="Menú"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>

    <main id="mainContent"><!-- page content goes here --></main>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <a href="index.html" class="logo" style="font-size:20px">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none"><path d="M22 6 L46 6 C50 6 53 9 53 13 L53 52 C53 56 50 59 46 59 L18 59 C14 59 11 56 11 52 L11 17 C11 14.5 12 12.2 13.7 10.5 L18.5 5.7 C19.5 4.7 21 6 22 6 Z" fill="var(--ink)"/><circle cx="18" cy="14" r="2.4" fill="var(--background)"/><path d="M24 26 L28 23 L36 23 L40 26 L43 29 L40 32 L38 31 L38 44 C38 45 37 46 36 46 L28 46 C27 46 26 45 26 44 L26 31 L24 32 L21 29 Z M30 23 C30 25 31 26 32 26 C33 26 34 25 34 23" fill="var(--brand)" stroke="var(--brand)" stroke-width="0.6" stroke-linejoin="round"/></svg>
            LOOK<span style="color:var(--brand)">.</span>
          </a>
          <p>El marketplace de moda circular. Compra, vende y reutiliza ropa de segunda mano.</p>
        </div>
        <div class="footer__links">
          <h4>Explorar</h4>
          <ul>
            <li><a href="catalogo.html">Marketplace</a></li>
            <li><a href="catalogo.html">Mujer</a></li>
            <li><a href="catalogo.html">Hombre</a></li>
            <li><a href="catalogo.html">Accesorios</a></li>
          </ul>
        </div>
        <div class="footer__links">
          <h4>Cuenta</h4>
          <ul>
            <li><a href="perfil.html">Mi perfil</a></li>
            <li><a href="favoritos.html">Favoritos</a></li>
            <li><a href="contacto.html">Contacto</a></li>
          </ul>
        </div>
        <div class="footer__social">
          <h4>Síguenos</h4>
          <div class="social-icons">
            <a href="#" aria-label="Instagram"><span class="material-icons-outlined">photo_camera</span></a>
            <a href="#" aria-label="Twitter"><span class="material-icons-outlined">tag</span></a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2025 LOOK. Todos los derechos reservados.</p>
      </div>
    </footer>

    <!-- ===== CART SIDEBAR ===== -->
    <aside class="cart-sidebar" id="cartSidebar">
      <div class="cart-sidebar__header">
        <h3>Tu carrito</h3>
        <button class="cart-close" id="cartClose">&times;</button>
      </div>
      <div class="cart-sidebar__body" id="cartBody"><div class="cart-empty">Tu carrito está vacío</div></div>
      <div class="cart-sidebar__footer">
        <div class="cart-total"><span>Total:</span><strong id="cartTotal">₡0</strong></div>
        <button class="btn btn--primary btn--full" id="checkoutBtn">Finalizar compra</button>
      </div>
    </aside>
    <div class="cart-overlay" id="cartOverlay"></div>

    <!-- ===== SEARCH SECTION ===== -->
    <section class="search-section" id="searchSection">
      <div class="search__inner">
        <div class="search__bar">
          <input type="text" class="search__input" id="searchInput" placeholder="Buscar prendas, marcas, vendedores..." />
          <button class="btn btn--primary" id="searchSubmit">Buscar</button>
          <button class="search__close" id="searchClose">&times;</button>
        </div>
        <div class="search__filters" id="searchFilters">
          <div class="search__filter-group">
            <h4 class="search__filter-title">Talla</h4>
            <div class="search__filter-options" id="filterSize">
              <label><input type="checkbox" value="XS" /> XS</label>
              <label><input type="checkbox" value="S" /> S</label>
              <label><input type="checkbox" value="M" /> M</label>
              <label><input type="checkbox" value="L" /> L</label>
              <label><input type="checkbox" value="XL" /> XL</label>
            </div>
          </div>
          <div class="search__filter-group">
            <h4 class="search__filter-title">Color</h4>
            <div class="search__filter-options" id="filterColor">
              <label><input type="checkbox" value="Negro" /> Negro</label>
              <label><input type="checkbox" value="Blanco" /> Blanco</label>
              <label><input type="checkbox" value="Azul" /> Azul</label>
              <label><input type="checkbox" value="Rojo" /> Rojo</label>
              <label><input type="checkbox" value="Verde" /> Verde</label>
              <label><input type="checkbox" value="Rosa" /> Rosa</label>
            </div>
          </div>
          <div class="search__filter-group">
            <h4 class="search__filter-title">Marca</h4>
            <div class="search__filter-options" id="filterBrand">
              <label><input type="checkbox" value="Zara" /> Zara</label>
              <label><input type="checkbox" value="H&M" /> H&amp;M</label>
              <label><input type="checkbox" value="Nike" /> Nike</label>
              <label><input type="checkbox" value="Adidas" /> Adidas</label>
              <label><input type="checkbox" value="Levi's" /> Levi's</label>
              <label><input type="checkbox" value="Mango" /> Mango</label>
            </div>
          </div>
          <div class="search__filter-group">
            <h4 class="search__filter-title">Precio</h4>
            <div class="search__filter-range">
              <input type="number" id="filterPriceMin" placeholder="Min" />
              <span>—</span>
              <input type="number" id="filterPriceMax" placeholder="Max" />
            </div>
          </div>
          <div class="search__filter-actions">
            <button class="btn btn--primary" id="filterApply" style="flex:1">Aplicar filtros</button>
            <button class="btn btn--outline" id="filterClear" style="flex:1">Limpiar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== AUTH MODAL ===== -->
    <div class="modal-overlay" id="authModal">
      <div class="modal modal--auth">
        <div class="modal__header">
          <h3 class="modal__title" id="authModalTitle">Iniciar sesión</h3>
          <button class="modal__close" data-modal="authModal">&times;</button>
        </div>
        <div class="modal__body">
          <div class="auth-tabs">
            <button class="auth-tab active" data-auth="login">Iniciar sesión</button>
            <button class="auth-tab" data-auth="register">Crear cuenta</button>
          </div>
          <form class="auth-form" id="loginForm">
            <div class="form-group"><input type="email" placeholder="Correo electrónico" required /><span class="form-error"></span></div>
            <div class="form-group"><input type="password" placeholder="Contraseña" required /><span class="form-error"></span></div>
            <button type="submit" class="btn btn--primary btn--full">Entrar</button>
          </form>
          <form class="auth-form" id="registerForm" style="display:none">
            <div class="form-group"><input type="text" placeholder="Nombre completo" required /><span class="form-error"></span></div>
            <div class="form-group"><input type="email" placeholder="Correo electrónico" required /><span class="form-error"></span></div>
            <div class="form-group"><input type="password" placeholder="Contraseña" required minlength="4" /><span class="form-error"></span></div>
            <div class="form-group"><input type="password" placeholder="Confirmar contraseña" required minlength="4" /><span class="form-error"></span></div>
            <button type="submit" class="btn btn--primary btn--full">Crear cuenta</button>
          </form>
        </div>
      </div>
    </div>

    <!-- ===== PRODUCT DETAIL MODAL ===== -->
    <div class="modal-overlay" id="productModal">
      <div class="modal modal--product">
        <div class="modal__header">
          <h3 class="modal__title">Detalle del producto</h3>
          <button class="modal__close" data-modal="productModal">&times;</button>
        </div>
        <div class="modal__body">
          <div class="product-detail" id="productDetail">
            <div class="product-detail__image" id="productDetailImage"><span class="material-icons-outlined" style="font-size:64px">checkroom</span></div>
            <div class="product-detail__info">
              <h2 class="product-detail__name" id="productDetailName">Nombre</h2>
              <p class="product-detail__price" id="productDetailPrice">₡0</p>
              <div class="product-detail__meta">
                <div class="product-detail__field"><span class="product-detail__label">Talla</span><span id="productDetailSize" style="font-weight:700">—</span></div>
                <div class="product-detail__field"><span class="product-detail__label">Color</span><span id="productDetailColor" style="font-weight:700">—</span></div>
                <div class="product-detail__field"><span class="product-detail__label">Marca</span><span id="productDetailBrand" style="font-weight:700">—</span></div>
                <div class="product-detail__field"><span class="product-detail__label">Estado</span><span id="productDetailCondition" style="font-weight:700">—</span></div>
              </div>
              <p class="product-detail__desc" id="productDetailDesc">Descripción del producto.</p>
              <div class="product-detail__seller" id="productDetailSeller">
                <span class="product-detail__seller-avatar"><span class="material-icons-outlined" style="font-size:40px">person</span></span>
                <div><strong id="productDetailSellerName" style="font-size:15px;font-weight:700">Vendedor</strong><br><span class="product-detail__seller-rating" id="productDetailSellerRating">★★★★★</span></div>
              </div>
              <div class="product-detail__actions">
                <button class="btn btn--primary" id="productDetailAddCart">Añadir al carrito</button>
                <button class="btn btn--outline" id="productDetailFav"><span class="material-icons-outlined">favorite_border</span> Favorito</button>
                <button class="btn btn--outline" id="productDetailChat"><span class="material-icons-outlined">chat_bubble_outline</span> Contactar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CHAT MODAL ===== -->
    <div class="modal-overlay" id="chatModal">
      <div class="modal modal--chat">
        <div class="modal__header"><h3 class="modal__title">Mensajes</h3><button class="modal__close" data-modal="chatModal">&times;</button></div>
        <div class="modal__body" style="flex:1;overflow:hidden;display:flex;flex-direction:column">
          <div class="chat">
            <div class="chat__list" id="chatList">
              <div class="chat__list-header"><input type="text" class="chat__search" placeholder="Buscar conversación..." /></div>
              <div class="chat__conversations" id="chatConversations"></div>
            </div>
            <div class="chat__view" id="chatView">
              <div class="chat__view-header" id="chatViewHeader"><span class="chat__view-name">Selecciona una conversación</span></div>
              <div class="chat__messages" id="chatMessages"><div class="chat__empty">Selecciona un chat para ver los mensajes</div></div>
              <div class="chat__input-area">
                <input type="text" class="chat__input" id="chatInput" placeholder="Escribe un mensaje..." disabled />
                <button class="btn btn--primary" id="chatSend" disabled>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== SELLER PROFILE MODAL ===== -->
    <div class="modal-overlay" id="sellerModal">
      <div class="modal modal--seller">
        <div class="modal__header"><h3 class="modal__title">Perfil del vendedor</h3><button class="modal__close" data-modal="sellerModal">&times;</button></div>
        <div class="modal__body">
          <div class="seller-profile" id="sellerProfile">
            <div class="seller-profile__header">
              <div class="seller-profile__avatar" id="sellerProfileAvatar"><span class="material-icons-outlined" style="font-size:36px">person</span></div>
              <div class="seller-profile__info">
                <h2 id="sellerProfileName">Nombre</h2>
                <div class="seller-profile__rating" id="sellerProfileRating">★★★★★</div>
                <p class="seller-profile__joined" id="sellerProfileJoined">Miembro desde 2024</p>
              </div>
            </div>
            <div class="seller-profile__stats">
              <div class="seller-profile__stat"><strong id="sellerProfileProducts">0</strong><span>Productos</span></div>
              <div class="seller-profile__stat"><strong id="sellerProfileSales">0</strong><span>Ventas</span></div>
              <div class="seller-profile__stat"><strong id="sellerProfileRatingNum">0.0</strong><span>Valoración</span></div>
            </div>
            <div class="seller-profile__bio" id="sellerProfileBio"><p>Descripción del vendedor.</p></div>
            <h4 style="font-size:15px;font-weight:700;margin-bottom:12px">Productos de este vendedor</h4>
            <div class="products products--small" id="sellerProducts"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== UPLOAD PRODUCT MODAL ===== -->
    <div class="modal-overlay" id="uploadModal">
      <div class="modal modal--upload">
        <div class="modal__header"><h3 class="modal__title">Publicar producto</h3><button class="modal__close" data-modal="uploadModal">&times;</button></div>
        <div class="modal__body">
          <form class="upload-form" id="uploadForm">
            <div class="form-row">
              <div class="form-group form-group--half"><label class="form-label">Nombre</label><input type="text" id="uploadName" placeholder="Ej. Vestido floral" required /><span class="form-error"></span></div>
              <div class="form-group form-group--half"><label class="form-label">Precio (₡)</label><input type="number" id="uploadPrice" placeholder="0" min="0" required /><span class="form-error"></span></div>
            </div>
            <div class="form-group"><label class="form-label">Descripción</label><textarea id="uploadDesc" rows="3" placeholder="Describe la prenda..." required></textarea><span class="form-error"></span></div>
            <div class="form-row">
              <div class="form-group form-group--half">
                <label class="form-label">Categoría</label>
                <select id="uploadCategory" required><option value="">Selecciona</option><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="accesorios">Accesorios</option></select>
              </div>
              <div class="form-group form-group--half">
                <label class="form-label">Talla</label>
                <select id="uploadSize" required><option value="">Selecciona</option><option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group form-group--half">
                <label class="form-label">Color</label>
                <select id="uploadColor" required><option value="">Selecciona</option><option value="Negro">Negro</option><option value="Blanco">Blanco</option><option value="Azul">Azul</option><option value="Rojo">Rojo</option><option value="Verde">Verde</option></select>
              </div>
              <div class="form-group form-group--half"><label class="form-label">Marca</label><input type="text" id="uploadBrand" placeholder="Ej. Zara, Nike" /></div>
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <div class="upload-condition">
                <label><input type="radio" name="condition" value="Nuevo" checked /> Nuevo</label>
                <label><input type="radio" name="condition" value="Como nuevo" /> Como nuevo</label>
                <label><input type="radio" name="condition" value="Buen estado" /> Buen estado</label>
                <label><input type="radio" name="condition" value="Aceptable" /> Aceptable</label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Imagen</label>
              <div class="upload-image-area" id="uploadImageArea">
                <span class="material-icons-outlined">add_a_photo</span>
                <p>Haz clic para subir una imagen</p>
                <input type="file" id="uploadImage" accept="image/*" hidden />
              </div>
            </div>
            <button type="submit" class="btn btn--primary btn--full btn--lg">Publicar producto</button>
          </form>
        </div>
      </div>
    </div>
  `;
}
