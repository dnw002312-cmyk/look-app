# LOOK — Guía para Agentes IA

## Proyecto
Marketplace de compra y venta de ropa (moda circular). Dos implementaciones:
- **Web**: HTML + CSS + JS vanilla (sin dependencias)
- **App Android**: Flutter con Provider + SharedPreferences

## Estructura
```
RopexChange/
├── index.html              # Web: home (hero)
├── catalogo.html           # Web: catálogo + categorías + filtros
├── favoritos.html          # Web: favoritos
├── contacto.html           # Web: formulario de contacto
├── css/style.css           # Web: estilos ARKET design system
├── js/layout.js            # Web: layout compartido (header, footer, modales)
├── js/script.js            # Web: lógica global (auth, carrito, chat, etc.)
├── look_app/               # Flutter
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── app.dart
│       ├── models/
│       │   ├── product.dart
│       │   ├── user.dart
│       │   └── message.dart
│       ├── data/
│       │   ├── products_data.dart
│       │   └── users_data.dart
│       ├── providers/
│       │   ├── auth_provider.dart
│       │   ├── cart_provider.dart
│       │   ├── chat_provider.dart
│       │   ├── favorites_provider.dart
│       │   ├── follow_provider.dart
│       │   └── theme_provider.dart
│       ├── screens/
│       │   ├── auth_screen.dart
│       │   ├── cart_screen.dart
│       │   ├── catalog_screen.dart
│       │   ├── chat_screen.dart
│       │   ├── contact_screen.dart
│       │   ├── favorites_screen.dart
│       │   ├── home_screen.dart
│       │   ├── product_detail_screen.dart
│       │   ├── seller_profile_screen.dart
│       │   └── upload_screen.dart
│       └── widgets/
│           ├── category_card.dart
│           └── product_card.dart
├── INSTRUCCIONES.txt
├── DESIGN.md               # ARKET design system reference
└── AGENTS.md
```

## ARKET Design System (DESIGN.md)
Estilo minimalista editorial inspirado en ARKET/COS.

### Colores
| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-canvas` | `#ffffff` | Fondos, cards, modales |
| `--color-ink` | `#000000` | Texto principal, bordes |
| `--color-ash` | `#e0e0e0` | Bordes sutiles, divisores |
| `--color-graphite` | `#666666` | Placeholders, info secundaria |
| `--color-hint` | `#eaeae8` | Bordes de botones no primarios |
| `--color-body` | `#767676` | Texto secundario |
| `--color-command` | `#3860be` | Links, CTAs |
| `--color-success` | `#38793f` | Indicadores de éxito |

### Tipografía
- **Primaria:** `IBM Plex Mono` (monoespaciada) — para casi todo el texto
- **Secundaria:** `Inter` — para subtexto
- **Peso:** 400 únicamente
- **Escala:** 10px (caption), 16px (body), 18px (subheading), 22px (heading), 28px (display)

### Espaciado
Base 4px. Escala: 4, 8, 12, 16, 20, 24, 32, 48, 64

### Bordes
- Inputs: 4px radius
- Botones: 2px radius
- General: 0px radius

### Sombras
Solo una: `rgba(0, 0, 0, 0.1) 0px 2px 10px 2px`

### Tema
Solo **light**. Sin modo oscuro.

## Web
- El proyecto usa múltiples páginas HTML con layout compartido via `js/layout.js`
- Abrir `index.html` directamente en navegador
- Sin build, sin dependencias
- Datos en `js/script.js` → arrays `PRODUCTS_DATA`, `USERS`, `CATEGORIES`

## Flutter
```powershell
cd look_app
flutter create --project-name look_app .   # solo la primera vez
flutter pub get
flutter run
```

## Convenciones
- **Provider** para estado (auth, cart, chat, favorites, follow)
- **SharedPreferences** para persistencia
- **Material 3** con `colorSchemeSeed: Color(0xFF3860BE)`
- `withValues(alpha:)` para opacidad (no `withOpacity`)
- `const` widgets siempre que sea posible
- `CartItem` y demás modelos incluyen `toJson()`/`fromJson()` para serialización
- Sin `BuildContext` fuera del widget tree
- Solo tema light (ARKET design)

## Persistencia (API)
Toda la data se persiste en el backend Express (`backend/`) con archivos JSON en `backend/data/`.
Token de auth en localStorage (web) o SharedPreferences (Flutter).

| Dato | Web | Flutter | API |
|------|-----|---------|-----|
| Token | localStorage `look_token` | SharedPreferences | `POST /api/auth/*` |
| Usuario | localStorage `look_user` | SharedPreferences | `GET /api/users/:id` |
| Productos | API fetch | ApiService | `GET /api/products` |
| Carrito | API fetch | ApiService | `GET/POST/DELETE /api/cart` |
| Favoritos | API fetch | ApiService | `GET/POST /api/favorites` |
| Follows | API fetch | ApiService | `GET/POST /api/follows` |
| Mensajes | API fetch | ApiService | `GET/POST /api/messages` |

## Deploy (producción)
```powershell
# 1. Railway → backend (sin cambios de código)
# Subir carpeta backend/ a railway.app
# Railway da una URL: https://look-backend.up.railway.app

# 2. Vercel → web
# Cambiar URL en js/script.js línea 6-7
# Subir raíz del repo a vercel.com

# 3. Windows .exe
# IMPORTANTE: copiar a ruta sin acentos (build falla con "ó","é",etc)
Copy-Item -Path ".\look_app" -Destination "C:\temp\look_app" -Recurse
cd C:\temp\look_app
flutter clean && flutter pub get
flutter build windows --release
# .exe en build\windows\x64\runner\Release\
```

## Comandos útiles
```powershell
# Backend (siempre primero)
cd backend
npm install
npm start

# Web — abrir en navegador (con backend corriendo)
start index.html

# Flutter
cd look_app
flutter analyze          # lint
flutter test             # tests
flutter build apk        # release APK
flutter build windows    # release .exe (desde ruta sin acentos)
```

## Datos de catálogo
12 productos hardcodeados + 3 usuarios. Para añadir/quitar:
- Web: editar arrays en `js/script.js`
- Flutter: editar `lib/data/products_data.dart` y `lib/data/users_data.dart`

## Funcionalidades implementadas
- Autenticación (login/register) — requerida para ver productos
- Catálogo con filtros por categoría
- Búsqueda con filtros avanzados (talla, color, marca, estado, precio)
- Detalle de producto (talla, color, marca, estado, descripción, vendedor)
- Favoritos ❤️
- Perfil de vendedor (rating, ventas, seguidores, bio)
- Follow/unfollow vendedores
- Chat comprador-vendedor
- Subir producto (formulario completo)
- Carrito de compras
- Contacto
