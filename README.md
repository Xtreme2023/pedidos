# FoodApp — Food Ordering Platform

App de pedidos de comida con 3 portales independientes: **Admin**, **Cliente** y **Restaurante**.

---

## Stack

| Tecnología | Uso |
|---|---|
| React 18 + Vite 5 + TypeScript | Core |
| Tailwind CSS + shadcn/ui | Estilos y componentes |
| Zustand | Estado global (auth, carrito, UI) |
| React Router v6 | Ruteo con rutas protegidas por rol |
| TanStack Query v5 | Fetching, caché y sincronización |
| Axios | Cliente HTTP con interceptores |

---

## Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd food-ordering-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Inicializar componentes shadcn/ui (la primera vez)
npx shadcn-ui@latest init

# 5. Levantar servidor de desarrollo
npm run dev
```

El servidor arranca en `http://localhost:3000`.

---

## Portales y rutas

| Portal | Ruta base | Rol requerido |
|---|---|---|
| Cliente | `/` | público + `client` |
| Restaurante | `/restaurant` | `restaurant` |
| Admin | `/admin` | `admin` |

El componente `RootRouter` redirige automáticamente al portal correcto según el rol del usuario autenticado.

---

## Estructura de carpetas

```
src/
├── app/                    # Shell de la aplicación
│   ├── providers/          # QueryProvider, RouterProvider, ThemeProvider
│   ├── router/             # RootRouter + guards (Auth, Role, Guest)
│   └── globals.css         # Variables CSS de shadcn/ui + Tailwind base
│
├── entities/               # Entidades de dominio (sin lógica de portal)
│   ├── user/               #   model (types, store) | api | ui
│   ├── restaurant/         #   model (types)        | api | ui
│   ├── order/              #   model (types)        | api | ui
│   ├── menu/               #   model (types)        | api | ui
│   └── category/           #   model (types)        | api | ui
│
├── shared/                 # Código reutilizable entre portales
│   ├── api/                # axiosInstance, interceptors, endpoints
│   ├── config/             # env.ts — acceso tipado a import.meta.env
│   ├── hooks/              # useDebounce, useLocalStorage, useMediaQuery
│   ├── lib/                # queryClient, utils (cn helper)
│   ├── stores/             # authStore (Zustand), uiStore (Zustand)
│   ├── types/              # auth.types, api.types, common.types
│   └── ui/
│       ├── components/     # Button, Input, Modal, Spinner, Table, Toast
│       └── layouts/        # BaseLayout, AuthLayout
│
└── portals/
    ├── admin/              # Portal de administración global
    │   ├── routes/         # AdminRoutes.tsx
    │   ├── layouts/        # AdminLayout (sidebar + header)
    │   ├── pages/          # Dashboard, Users, Restaurants, Orders, Reports, Settings
    │   ├── widgets/        # AdminSidebar, AdminHeader, StatsOverview, RecentOrdersTable
    │   └── features/
    │       ├── manage-users/           # model (hook) | ui (Table, Form, Filters)
    │       ├── manage-restaurants/     # model (hook) | ui (Table, Form, Filters)
    │       ├── view-reports/           # model (hook) | ui (SalesChart, OrdersChart, Filters)
    │       └── app-settings/           # model (hook) | ui (General, Notifications, Payment)
    │
    ├── client/             # Portal del cliente final
    │   ├── routes/         # ClientRoutes.tsx
    │   ├── layouts/        # ClientLayout (header + bottom nav mobile)
    │   ├── pages/          # Home, Search, RestaurantDetail, Checkout, Tracking, History, Profile
    │   ├── widgets/        # ClientHeader, CartDrawer, RestaurantList, OrderTracker, CategoryFilter
    │   └── features/
    │       ├── search-restaurants/     # model (hook) | ui (SearchBar, SearchResults)
    │       ├── manage-cart/            # model (cartStore, hook) | ui (CartItem, Summary, AddButton)
    │       ├── place-order/            # model (hook) | ui (OrderForm, AddressSelector, PaymentSelector)
    │       ├── track-order/            # model (hook) | ui (TrackingMap, OrderTimeline)
    │       └── auth/                   # model (hook) | ui (LoginForm, RegisterForm, ForgotPassword)
    │
    └── restaurant/         # Portal del operador de restaurante
        ├── routes/         # RestaurantRoutes.tsx
        ├── layouts/        # RestaurantLayout (sidebar + header + notifications)
        ├── pages/          # Dashboard, Menu, Orders, OrderDetail, Analytics, Settings
        ├── widgets/        # RestaurantSidebar, RestaurantHeader, IncomingOrdersPanel, MenuOverview
        └── features/
            ├── manage-menu/            # model (hook) | ui (Form, List, CategoryManager, Toggle)
            ├── handle-orders/          # model (hook) | ui (OrderCard, StatusActions, Kanban)
            └── restaurant-settings/   # model (hook) | ui (Profile, Hours, Delivery)
```

---

## Convenciones de arquitectura (Feature-Sliced Design adaptado)

### Capas (de menor a mayor dependencia permitida)

```
shared → entities → portals/*/features → portals/*/widgets → portals/*/pages → app
```

- `shared` no importa de ninguna otra capa.
- `entities` solo importa de `shared`.
- `features` importa de `entities` y `shared`.
- `widgets` compone `features` + `entities`.
- `pages` orquesta `widgets` + `features`.
- Nunca importar entre portales distintos.

### Barrel exports (index.ts)

Cada carpeta expone su API pública via `index.ts`. Importar siempre desde el índice, nunca desde archivos internos de otra feature.

```ts
// ✅ Correcto
import { useCart } from '@client/features/manage-cart'

// ❌ Incorrecto
import { useCart } from '@client/features/manage-cart/model/useCart'
```

### Zustand stores

| Store | Ubicación | Contenido |
|---|---|---|
| `authStore` | `shared/stores` | user, token, isAuthenticated, rol |
| `uiStore` | `shared/stores` | sidebar open/close, modal stack, toast queue |
| `cartStore` | `client/features/manage-cart/model` | items[], totals, restaurantId |

### Aliases de TypeScript / Vite

| Alias | Ruta |
|---|---|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@entities` | `src/entities/` |
| `@shared` | `src/shared/` |
| `@admin` | `src/portals/admin/` |
| `@client` | `src/portals/client/` |
| `@restaurant` | `src/portals/restaurant/` |

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción (tsc + vite build)
npm run preview      # Preview del build de producción
npm run type-check   # Validación de tipos sin emitir
npm run lint         # ESLint
npm run shadcn       # Agregar componentes shadcn/ui
```

---

## Agregar un componente shadcn/ui

```bash
npm run shadcn -- add button
npm run shadcn -- add dialog
npm run shadcn -- add data-table
```

Los componentes se instalan en `src/shared/ui/components/` según el alias configurado en `components.json`.
