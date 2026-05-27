# LOOK — Guía para Agentes IA

## Proyecto
Marketplace de compra y venta de ropa (moda circular). Tres implementaciones:
- **Web**: React + TanStack Start + Tailwind CSS (carpeta `web/`)
- **App Android**: Flutter con Provider + SharedPreferences (carpeta `look_app/`)
- **Backend**: Express + Supabase (carpeta `backend/`)

## Estructura
```
RopexChange/
├── web/                        # Frontend web (React + TanStack Start)
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── MobileShell.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts          # Servicio API (conecta con backend Express)
│   │   │   ├── favorites.tsx   # Context de favoritos
│   │   │   ├── mock-data.ts    # Datos de respaldo
│   │   │   ├── store.tsx       # Estado global (auth, productos, perfil)
│   │   │   └── utils.ts
│   │   ├── routes/
│   │   │   ├── __root.tsx      # Layout raíz
│   │   │   ├── index.tsx       # Landing page
│   │   │   ├── login.tsx       # Login
│   │   │   ├── register.tsx    # Registro + onboarding
│   │   │   ├── home.tsx        # Home con categorías y productos
│   │   │   ├── search.tsx      # Búsqueda con filtros
│   │   │   ├── product.$id.tsx # Detalle de producto
│   │   │   ├── cart.tsx        # Carrito
│   │   │   ├── favorites.tsx   # Favoritos
│   │   │   ├── profile.tsx     # Perfil de usuario
│   │   │   ├── chat.index.tsx  # Lista de chats
│   │   │   ├── chat.$id.tsx    # Chat individual
│   │   │   ├── sell.tsx        # Subir producto
│   │   │   ├── ai.tsx          # IA Stylist
│   │   │   └── notifications.tsx
│   │   ├── router.tsx
│   │   ├── start.ts
│   │   └── styles.css
│   ├── package.json
│   ├── vite.config.ts
│   └── .env                    # VITE_API_URL apunta al backend
├── backend/                    # Backend Express + Supabase
│   ├── server.js
│   ├── db.js
│   ├── schema.sql
│   └── package.json
├── look_app/                   # Flutter app
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── app.dart
│       ├── models/
│       ├── data/
│       ├── providers/
│       ├── screens/
│       └── widgets/
├── web-legacy/                 # Archivos HTML antiguos (respaldo)
├── DESIGN.md                   # ARKET design system reference
└── AGENTS.md
```

## Diseño LOOK
Estilo moderno mobile-first inspirado en apps como Vinted/Depop.

### Colores
| Variable | Valor | Uso |
|----------|-------|-----|
| `--brand` | `oklch(0.74 0.09 153)` | Verde suave, CTAs principales |
| `--ink` | `oklch(0.22 0.05 250)` | Azul oscuro, texto principal |
| `--background` | `oklch(0.99 0.003 240)` | Fondo principal |
| `--muted` | `oklch(0.96 0.008 240)` | Fondos secundarios |
| `--border` | `oklch(0.92 0.008 240)` | Bordes |

### Tipografía
- **Fuente:** `Plus Jakarta Sans` (sans-serif)
- **Pesos:** 400, 500, 600, 700, 800

### Componentes
- Bordes redondeados: `rounded-2xl`, `rounded-3xl`, `rounded-full`
- Sombras suaves con `shadow-lg`
- Mobile-first con `mobile-frame` (max-width: 420px)

## Web (React)
```powershell
cd web
npm install         # o bun install
npm run dev         # desarrollo en http://localhost:3000
npm run build       # build de producción
```

### Variables de entorno
```env
VITE_API_URL=http://localhost:3001
```

### Estado global
- `useStore()` - Auth, perfil, productos (src/lib/store.tsx)
- `useFavorites()` - Favoritos (src/lib/favorites.tsx)
- `api.*` - Llamadas al backend (src/lib/api.ts)

## Backend
```powershell
cd backend
npm install
npm start           # corre en http://localhost:3001
```

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login con email |
| POST | `/api/auth/register` | Registro |
| GET | `/api/products` | Listar productos (con filtros) |
| GET | `/api/products/:id` | Detalle producto |
| POST | `/api/products` | Crear producto (auth) |
| GET | `/api/users/:id` | Perfil usuario |
| PUT | `/api/users/profile` | Actualizar perfil (auth) |
| GET | `/api/cart` | Ver carrito (auth) |
| POST | `/api/cart` | Añadir al carrito (auth) |
| DELETE | `/api/cart/:id` | Quitar del carrito (auth) |
| GET | `/api/favorites` | Ver favoritos (auth) |
| POST | `/api/favorites/toggle` | Toggle favorito (auth) |
| GET | `/api/follows` | Ver follows (auth) |
| POST | `/api/follows/toggle` | Toggle follow (auth) |
| GET | `/api/messages` | Lista conversaciones (auth) |
| GET | `/api/messages/:id` | Mensajes de conversación (auth) |
| POST | `/api/messages/:id` | Enviar mensaje (auth) |

## Flutter
```powershell
cd look_app
flutter pub get
flutter run
```

## Convenciones

### Web (React)
- **TanStack Router** para rutas file-based
- **React Context** para estado global
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- Componentes funcionales con hooks
- TypeScript estricto

### Flutter
- **Provider** para estado (auth, cart, chat, favorites, follow)
- **SharedPreferences** para persistencia
- **Material 3** con `colorSchemeSeed: Color(0xFF3860BE)`
- `withValues(alpha:)` para opacidad (no `withOpacity`)
- `const` widgets siempre que sea posible

## Persistencia
Token de auth en localStorage (web) o SharedPreferences (Flutter).

| Dato | Web (React) | Flutter | API |
|------|-------------|---------|-----|
| Token | localStorage `look_token` | SharedPreferences | `POST /api/auth/*` |
| Usuario | localStorage `look_user` | SharedPreferences | `GET /api/users/:id` |
| Productos | api.products.list() | ApiService | `GET /api/products` |
| Carrito | api.cart.* | ApiService | `GET/POST/DELETE /api/cart` |
| Favoritos | api.favorites.* | ApiService | `GET/POST /api/favorites` |
| Follows | api.follows.* | ApiService | `GET/POST /api/follows` |
| Mensajes | api.messages.* | ApiService | `GET/POST /api/messages` |

## Deploy (producción)
```powershell
# 1. Railway → backend
# Subir carpeta backend/ a railway.app
# Railway da una URL: https://look-backend.up.railway.app

# 2. Vercel/Cloudflare → web
cd web
# Cambiar VITE_API_URL en .env a la URL de Railway
npm run build
# Subir carpeta web/ a vercel.com o Cloudflare Pages

# 3. Windows .exe (Flutter)
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

# Web (React)
cd web
npm install
npm run dev         # http://localhost:3000
npm run build

# Flutter
cd look_app
flutter analyze     # lint
flutter test        # tests
flutter build apk   # release APK
```

## Funcionalidades implementadas
- Autenticación (login/register) con onboarding completo
- Home con categorías y productos recomendados
- Búsqueda con filtros avanzados (talla, color, marca, estado, precio)
- Detalle de producto (talla, color, marca, estado, descripción, vendedor)
- Favoritos
- Perfil de usuario editable
- Perfil de vendedor (rating, ventas, seguidores, bio)
- Follow/unfollow vendedores
- Chat comprador-vendedor
- Subir producto (formulario completo)
- Carrito de compras
- IA Stylist (recomendaciones personalizadas)
- Notificaciones
