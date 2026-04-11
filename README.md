# LifeLink API (`lifelink_b`)

NestJS modular API with **Prisma** and **MySQL**, JWT authentication, and role-based access (`USER`, `BUSINESS`, `ADMIN`).

## Prerequisites

- Node.js 20+
- MySQL 8+ (local install **or** Docker — see below)

## Database

**Prisma `P1000` (“Authentication failed… `root`”)** means `DATABASE_URL` in `.env` does not match a real MySQL account. Pick one:

### Option A — Docker (matches `.env.example`)

From `lifelink_b/`:

```bash
docker compose up -d
# wait until healthy, then:
npm run db:setup
```

Connection string stays `mysql://root:password@127.0.0.1:3306/lifelink`.

### Option B — Your own MySQL / MariaDB

Set `DATABASE_URL` to a user and password that exist on your server, for example:

`mysql://lifelink:yourpassword@127.0.0.1:3306/lifelink`

Create DB and user in MySQL if needed, then run `npm run db:setup`.

On some Linux installs, `root` uses **socket auth** only; a dedicated app user (Option B) avoids that.

## Setup

1. Copy environment file and edit `DATABASE_URL` and `JWT_SECRET`:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies and generate the Prisma client:

   ```bash
   npm install
   npx prisma generate
   ```

3. Create tables and seed demo data in one step (required before the map and listings work):

   ```bash
   npm run db:setup
   ```

   Equivalent to `prisma db push` then `prisma db seed`. Demo password for all seeded accounts: **`lifelink-demo`**.

4. Start the API (default port **4000**):

   ```bash
   npm run start:dev
   ```

Health check: `http://localhost:4000/api/health`

If you see Prisma **`listings` table does not exist**, you skipped step 3 — run `npm run db:setup` again.

## API surface (prefix `/api`)

| Area        | Method & path                    | Notes                                      |
| ----------- | -------------------------------- | ------------------------------------------ |
| Auth        | `POST /auth/register`            | Body: email, password, name, role, phone   |
| Auth        | `POST /auth/login`               | Returns `accessToken`                      |
| Users       | `GET/PATCH /users/me`            | Bearer JWT                                 |
| Business    | `GET/PATCH /business/profile`    | Business role                            |
| Listings    | `GET /listings`                  | Query: type, lat, lng, radiusKm, bloodGroup |
| Listings    | `GET /listings/:id`              | Public detail                             |
| Listings    | `GET /listings/mine`             | Bearer JWT                                |
| Listings    | `POST/PATCH/DELETE /listings/...`| Business (or admin)                       |
| Blood       | `GET /blood/search`              | lat, lng, optional bloodGroup, radiusKm   |
| Blood       | `POST /blood/donor`              | User role — donor registration           |
| Blood       | `GET /blood/ai-suggest`          | Heuristic ranking preview                |
| Map         | `GET /map/markers`               | lat, lng, optional type, radiusKm        |
| News        | `GET /news`                      | `ListingType.NEWS`                        |
| Jobs        | `GET /jobs`                      | `ListingType.JOB`                         |

## Production notes

- Run `prisma migrate deploy` in CI/CD instead of `db push`.
- Rotate `JWT_SECRET` and restrict CORS `FRONTEND_ORIGIN` to your domain.
- Add rate limiting and observability as you harden the deployment.
