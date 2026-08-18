# artemis-mobbackend

Servicio independiente que expone la API REST consumida por `artemis-mobile` (cliente móvil, Expo). No depende
del código ni del proceso de `artemis-backend`; no lo llama ni es llamado por él. Su única relación con ese
otro servicio es que ambos leen y escriben en la misma base de datos PostgreSQL (`artemis_db`), cada uno con
su propio rol.

## Correr el servicio

```
npm install
npm run dev      # nodemon, recarga en caliente
npm start        # producción
```

Puerto por defecto: `3000` (configurable con `PORT`).

## Variables de entorno (`.env`)

| Variable | Uso |
|---|---|
| `PORT` | Puerto HTTP del servicio |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE` | Conexión a PostgreSQL |
| `JWT_SECRET` | Firma de tokens JWT — el servicio no arranca si falta |
| `CORS_ORIGIN` | Lista de orígenes permitidos, separados por coma (sin definir = cualquier origen, útil en desarrollo con Expo) |

## Contrato del servicio

Las rutas protegidas exigen `Authorization: Bearer <jwt>`; sin token válido responden `401`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/registro` | pública | Crea cuenta, responde `{ token, user }` |
| POST | `/api/login` | pública | Inicia sesión, responde `{ token, user }` |
| GET | `/api/recetas` | pública | Lista recetas |
| GET | `/api/recetas/buscar?q=` | pública | Búsqueda por título/chef/categoría |
| GET | `/api/recetas/guardadas` | protegida | Favoritas del usuario autenticado |
| GET | `/api/recetas/:id` | auth opcional | Detalle (ingredientes, pasos, `es_dueno`, `esta_guardada`) |
| POST | `/api/recetas` | protegida | Crea receta (multipart: `imagen` opcional) |
| DELETE | `/api/recetas/:id` | protegida, solo dueño | Elimina receta propia |
| POST | `/api/recetas/:id/guardar` | protegida | Guarda en favoritas |
| DELETE | `/api/recetas/:id/guardar` | protegida | Quita de favoritas |
| GET | `/api/usuarios/:id/recetas` | pública | Recetas publicadas por el usuario |
| GET | `/api/usuarios/:id` | auth opcional | Perfil (campos privados solo si es uno mismo) |
| PUT | `/api/usuarios/:id` | protegida, solo uno mismo | Edita perfil (multipart: `avatar` opcional) |
| DELETE | `/api/usuarios/:id` | protegida, solo uno mismo | Elimina la cuenta propia |

## Estructura

```
server.js              punto de entrada, monta las rutas
src/
  config/db.js          pool de PostgreSQL
  middleware/auth.js     authMiddleware / optionalAuthMiddleware (JWT)
  middleware/upload.js   multer (imágenes, máx. 5MB)
  middleware/rateLimiter.js
  routes/                authRoutes, recipeRoutes, userRoutes
```
