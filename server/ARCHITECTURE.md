# 4WHEELS Server — Architecture Guide

## Directory Tree

```
server/
├── package.json
├── tsconfig.json
├── .gitignore
├── src/
│   ├── server.ts                          # Entry point: boots HTTP + WS + workers
│   ├── app.ts                             # Express app: middleware stack + route mounting
│   │
│   ├── config/
│   │   └── env.ts                         # Env loading + validation (all config in one place)
│   │
│   ├── kernel/                            # Shared infrastructure — no module imports
│   │   ├── index.ts                       # Barrel export for all kernel modules
│   │   ├── database/
│   │   │   ├── client.ts                  # PrismaClient singleton
│   │   │   └── prisma/schema.prisma       # Full Prisma schema (13 models)
│   │   ├── cache/
│   │   │   └── redis.ts                   # ioredis singleton + cacheGet/cacheSet/cacheDel helpers
│   │   ├── queue/
│   │   │   └── index.ts                   # BullMQ queue definitions + enqueue helpers + Worker factory
│   │   ├── events/
│   │   │   ├── emitter.ts                 # Typed EventEmitter (AppEvents interface)
│   │   │   └── handlers/index.ts          # Cross-module event handler registration
│   │   ├── errors/
│   │   │   ├── index.ts                   # AppError, NotFoundError, ValidationError, etc.
│   │   │   └── handler.ts                 # Express error-handling middleware
│   │   ├── logger/
│   │   │   └── index.ts                   # Pino logger instance
│   │   ├── validation/
│   │   │   └── index.ts                   # Shared Zod schemas (pagination, UUID)
│   │   ├── types/
│   │   │   └── api.ts                     # PaginatedResult<T>, ApiResponse<T>, ApiError
│   │   ├── constants/
│   │   │   └── index.ts                   # Enums, CACHE_TTL, PAGINATION defaults
│   │   └── utils/                         # Pure utility functions (slugify, token, etc.)
│   │
│   ├── modules/                           # Feature modules — one per domain
│   │   ├── auth/                          # Register, login, refresh tokens
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── users/                         # Profile CRUD
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── users.validation.ts
│   │   │
│   │   ├── products/                      # Product catalog + category join
│   │   │   ├── products.routes.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts        # Cache-first reads via Redis
│   │   │   └── products.repository.ts     # Prisma queries
│   │   │
│   │   ├── categories/                    # Category CRUD
│   │   │   └── ...
│   │   │
│   │   ├── inventory/                     # Stock adjustments + audit logs
│   │   │   ├── inventory.routes.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── inventory.repository.ts
│   │   │
│   │   ├── cart/                          # Session-based shopping cart
│   │   │   ├── cart.routes.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── cart.repository.ts
│   │   │
│   │   ├── orders/                        # Order lifecycle + status transitions
│   │   │   ├── orders.routes.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.repository.ts
│   │   │
│   │   ├── payments/                      # Payment intent creation + webhook handler
│   │   │   ├── payments.routes.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.webhook.ts
│   │   │
│   │   ├── community/                     # Social features
│   │   │   ├── posts/                     # Crew posts (CRUD + prop)
│   │   │   ├── comments/                  # Post comments
│   │   │   ├── likes/                     # Post likes (toggle)
│   │   │   ├── follows/                   # Follow/unfollow system
│   │   │   └── feed/                      # Feed generation service + worker trigger
│   │   │
│   │   └── chat/                          # Real-time messaging
│   │       ├── chat.routes.ts             # REST: rooms + message history
│   │       ├── chat.controller.ts
│   │       ├── chat.service.ts
│   │       ├── chat.gateway.ts            # WebSocket message type handlers
│   │       └── chat.room.ts               # In-memory room presence tracker
│   │
│   ├── gateway/                           # API gateway layer
│   │   ├── ws/
│   │   │   └── index.ts                   # WebSocketServer setup + auth + heartbeat
│   │   └── middleware/
│   │       ├── auth.ts                    # JWT verification middleware
│   │       └── requestLogger.ts           # Morgan alternative via Pino
│   │
│   ├── jobs/                              # Job definitions (what + payload types)
│   │   ├── email/index.ts                 # EmailJob types
│   │   ├── notification/index.ts
│   │   ├── feed/index.ts
│   │   └── cleanup/index.ts
│   │
│   └── workers/                           # Worker process entry points (runnable separately)
│       ├── email.worker.ts
│       ├── notification.worker.ts
│       ├── feed.worker.ts
│       ├── cleanup.worker.ts
│       └── scheduler.ts                   # Cron job enqueuer
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 1. Folder Responsibilities

### `src/config/`
**Responsibility:** Single source of truth for all environment configuration. Loads `.env`, validates required vars, exports a typed config object.

**Files:** `env.ts`

**What NEVER belongs:** Business logic, secrets hardcoded, module-specific config (each module manages its own).

**Communication:** All modules import `from "../../config/env.js"` to read config values.

---

### `src/kernel/`
**Responsibility:** Shared infrastructure used by every module. Never imports from any module. If you change the kernel, everything downstream is affected — so it must be stable.

| Subfolder | Files | Responsibility |
|-----------|-------|----------------|
| `database/` | `client.ts`, `prisma/schema.prisma` | Prisma client singleton, database migration source |
| `cache/` | `redis.ts` | Redis client + `cacheGet`/`cacheSet`/`cacheDel` helpers |
| `queue/` | `index.ts` | BullMQ queue definitions + enqueue helpers + Worker factory |
| `events/` | `emitter.ts`, `handlers/index.ts` | Typed EventEmitter, cross-module event wiring |
| `errors/` | `index.ts`, `handler.ts` | Error classes + Express error middleware |
| `logger/` | `index.ts` | Pino logger instance |
| `validation/` | `index.ts` | Shared Zod schemas |
| `types/` | `api.ts` | Shared TypeScript types |
| `constants/` | `index.ts` | Enums, cache TTLs, pagination defaults |
| `utils/` | — | Pure utility functions |

**What NEVER belongs:** HTTP request handling, business logic, direct database queries beyond Prisma client init.

**Communication:** Re-exported via `kernel/index.ts` barrel. Modules import specific pieces: `from "../../kernel/cache/redis.js"`.

---

### `src/modules/`

Each module is a self-contained feature with its own route → controller → service → repository stack.

#### Standard module anatomy:
```
module/
├── module.routes.ts       # Express Router — defines endpoints, applies middleware
├── module.controller.ts   # Request/response handling — parses input, calls service, sends response
├── module.service.ts      # Business logic — orchestrates repositories + enqueues jobs + emits events
├── module.repository.ts   # Data access — Prisma queries (only this file touches Prisma models)
├── module.validation.ts   # Zod schemas for request validation
└── module.types.ts        # Module-specific types
```

**Communication rules:**
- **Routes → Controller** (Express calls controller methods)
- **Controller → Service** (controller parses request, delegates to service)
- **Service → Repository** (service asks repo for data)
- **Service → Kernel** (service uses events, queue, cache via kernel imports)
- **Repository → Database** (repo calls Prisma client)
- **Modules NEVER import other modules directly.** Cross-module communication happens via the event bus only.

---

### `src/gateway/`
**Responsibility:** API gateway concerns that sit between the HTTP/WS transport and the modules.

| Subfolder | Files | Responsibility |
|-----------|-------|----------------|
| `ws/` | `index.ts` | Creates `WebSocketServer`, authenticates connections via JWT, routes messages to `ChatGateway` |
| `middleware/` | `auth.ts`, `requestLogger.ts` | Express middleware that modules are decoupled from |

**What NEVER belongs:** Business logic, module-specific route handlers.

---

### `src/jobs/` vs `src/workers/`

**`jobs/`** — Job definitions and handlers. Each domain folder contains:
- `index.ts` — TypeScript types for the job payload (what data the job needs)
- `handlers.ts` — The actual processor function (how to execute the job)

**`workers/`** — Runnable process entry points. Each file bootstraps its own Node process that:
1. Connects to Redis + Database
2. Creates a `Worker` from the queue library
3. Imports the handler from `jobs/`
4. Listens for jobs forever

**Why separate `jobs/` from `workers/`:**
- Job definitions are imported by both the API server (to enqueue) and the worker (to process). They live in `jobs/` so the API server doesn't need to import worker bootstrap code.
- Workers are independent processes — each can be scaled separately (e.g., 5 email workers, 2 feed workers).
- `workers/scheduler.ts` is a cron-like process that enqueues recurring jobs (cleanup, maintenance).

---

## 2. How WebSocket Chat Integrates with Express

```
client ──WS──> ws://host/ws?token=JWT
                  │
           ┌──────┴──────┐
           │  gateway/    │  Authenticates via JWT
           │  ws/index.ts │  Sets ws.userId
           └──────┬──────┘
                  │
           ┌──────┴──────┐
           │  modules/    │  routes message to ChatGateway.handleMessage()
           │  chat/       │  which calls ChatService.saveMessage()
           │  chat.gateway│
           └──────┬──────┘
                  │
           ┌──────┴──────┐
           │  kernel/     │  eventBus.emit("chat:messageSent", ...)
           │  events/     │  (triggers notification worker, etc.)
           └─────────────┘
```

The `WebSocketServer` shares the same `http.createServer()` as Express — no separate port needed. The WS path is `/ws`, distinct from the REST API at `/api/*`.

---

## 3. Where Redis Is Used

| Feature | Implementation | Why Redis |
|---------|---------------|-----------|
| **Queue backend** | BullMQ stores job state in Redis | BullMQ requirement — provides reliable job storage |
| **Cache layer** | `cacheGet`/`cacheSet` in services | Products, feed, profiles — reduce DB load |
| **Rate limiting** | `express-rate-limit` with Redis store | Consistent rate limits across multiple instances |
| **WebSocket Pub/Sub** (future) | Redis Pub/Sub for WS horizontal scaling | Broadcast messages across server instances |
| **Session store** (future) | `connect-redis` | Persistent sessions across restarts |

---

## 4. How Background Jobs Are Separated from API Requests

```
API Request                     Background Worker
─────────────                   ─────────────────
Client ──> Controller           Worker (separate process)
              │                         │
              v                         │
           Service                      │
              │                         │
              ├──> Repository (DB)      │
              │                         │
              └──> enqueueEmail() ──────┼──> Worker picks up job
                   (returns instantly)  │       │
                                        │       v
                                        │    handler()
                                        │       │
                                        │       └──> Email service
```

**Key principles:**
- API controllers never wait for heavy work. They call `enqueue*()` which adds a job to Redis/BullMQ and returns immediately.
- Workers run in separate OS processes (`tsx src/workers/email.worker.ts`), independently deployable and scalable.
- The `app.ts` process (Express) does NOT process jobs — it only enqueues them. This keeps API response times fast.
- Workers can be scaled independently: `docker compose up --scale email-worker=5`.

---

## 5. Event System — How Modules Communicate

```typescript
// 1. Define the event payload type in emitter.ts
export interface AppEvents {
  "order:placed": { orderId: string; userId: string; total: number };
}

// 2. Publish from a service
eventBus.emit("order:placed", { orderId, userId, total });

// 3. Subscribe in events/handlers/index.ts
eventBus.on("order:placed", async (payload) => {
  const notifService = (await import("../../modules/notifications/...")).default;
  await notifService.sendOrderConfirmation(payload.userId);
});
```

**Rules:**
- Modules emit events but never import another module's service directly.
- Event handlers use dynamic `import()` to avoid circular dependencies.
- All handler registrations live in one file (`events/handlers/index.ts`) so cross-module wiring is visible at a glance.
- The event bus is in-process (EventEmitter). For horizontal scaling, swap to Redis Pub/Sub.

**Example event flows mapped to this app's features:**
| Event | Publisher | Reactors |
|-------|-----------|----------|
| `user:registered` | Auth service | Send welcome email, create welcome notification |
| `order:placed` | Orders service | Send confirmation email, reserve inventory, generate activity feed post |
| `order:statusChanged` | Orders service | Push notification to user |
| `post:created` | Posts service | Generate feed entries for followers |
| `chat:messageSent` | Chat gateway | Push notification if user is offline |

---

## 6. How to Avoid Circular Dependencies

1. **Strict layering:** Modules import only from `kernel/`. Kernel imports nothing from modules.
2. **No direct module-to-module imports.** If Product needs data from Inventory, it emits an event or calls a shared kernel utility.
3. **Lazy event handlers:** `events/handlers/index.ts` uses `await import(...)` (dynamic imports) so module code is never loaded at registration time.
4. **Repository isolation:** Services only depend on their own repository and kernel. No cross-repository calls.
5. **Barrel files are explicit:** `kernel/index.ts` is the only barrel. Module barrels (`index.ts`) only re-export routes for `app.ts`.

---

## 7. How to Keep It Maintainable as the Application Grows

| Strategy | Implementation |
|----------|---------------|
| **One file = one concern** | `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts` — never mixed |
| **Repository pattern** | Prisma queries are isolated in repositories. If Prisma is replaced, only one file per module changes |
| **Cache abstraction** | Services use `cacheGet/cacheSet`, not Redis directly. Swap Redis for another store without touching services |
| **Event-driven decoupling** | Adding a new reaction to an existing event = add one handler file, register it in `handlers/index.ts`. Zero changes to the publisher |
| **Worker isolation** | Each worker is its own entry point, independently testable and deployable |
| **No implicit globals** | Every dependency (Prisma, Redis) is explicitly obtained via `getPrisma()`, `getRedis()` — no magic |
| **Validation at the edge** | Zod schemas in `*.validation.ts` validate at the controller boundary. Internal code trusts its types |
| **Naming convention** | `module.layer.ts` — `products.service.ts`, `orders.routes.ts`. Find any file by its layer instantly |
