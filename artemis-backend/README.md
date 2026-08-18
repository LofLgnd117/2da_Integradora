# artemis-backend

Servicio independiente que expone la API REST consumida por `artemis-app` (cliente web). No depende del código
ni del proceso de `artemis-mobbackend`; no lo llama ni es llamado por él. Su única relación con ese otro
servicio es que ambos leen y escriben en la misma base de datos PostgreSQL (`artemis_db`), cada uno con su
propio rol.

## Correr el servicio

```
npm install
npm run dev      # nodemon, recarga en caliente
npm start        # producción
```

Puerto por defecto: `5000` (configurable con `PORT`).

## Variables de entorno (`.env`)

| Variable | Uso |
|---|---|
| `PORT` | Puerto HTTP del servicio |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` | Conexión a PostgreSQL |
| `JWT_SECRET` | Firma de tokens JWT — el servicio no arranca si falta |
| `CORS_ORIGIN` | Lista de orígenes permitidos, separados por coma (default: `http://localhost:5173`) |

## Contrato del servicio

Todas las respuestas son JSON con forma `{ success, ... }`. Las rutas protegidas exigen
`Authorization: Bearer <jwt>`; sin token válido responden `401`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | pública | Crea cuenta, responde `{ token, user }` |
| POST | `/api/auth/login` | pública | Inicia sesión, responde `{ token, user }` |
| GET | `/api/recipes` | pública | Lista recetas, filtros `?categoria=&buscar=` |
| GET | `/api/recipes/:id` | pública | Detalle de receta (incluye ingredientes y pasos) |
| POST | `/api/recipes` | protegida | Crea receta (multipart: imagen opcional) |
| POST | `/api/recipes/save` | protegida | Guarda una receta en "Mis Favoritas" |
| GET | `/api/recipes/saved/:userId` | protegida, solo dueño | Favoritas del usuario autenticado |
| DELETE | `/api/recipes/save/:recipeId` | protegida | Quita de favoritas |
| DELETE | `/api/recipes/:id` | protegida, solo dueño | Elimina receta propia |
| GET | `/api/users/:id` | pública | Perfil y recetas publicadas |
| PUT | `/api/users/:id` | protegida, solo dueño | Edita el propio perfil |
| GET | `/api/health` | pública | Estado del servicio |

## Estructura

```
src/
  app.js              punto de entrada, monta las rutas
  config/db.js         pool de PostgreSQL
  middleware/auth.js    requireAuth / optionalAuth (JWT)
  middleware/rateLimiter.js
  routes/               authRoutes, recipeRoutes, userRoutes
```
