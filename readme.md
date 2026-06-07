# Auth API

Authentication API built with Node.js, Express, MongoDB and Redis.

## Documentation

- Production (Swagger): [https://api.auth.ispapps.com/docs](https://api.auth.ispapps.com/docs)
- Local (Swagger): [http://localhost:3333/docs](http://localhost:3333/docs) — available after running `npm run dev`

## API endpoints

| Method | Route                    | Auth         | Description                          |
| ------ | ------------------------ | ------------ | ------------------------------------ |
| `POST` | `/login`                 | No           | Authenticate with email and password |
| `GET`  | `/health`                | No           | Check API, MongoDB and Redis status  |
| `GET`  | `/.well-known/jwks.json` | No           | Public JWT key (JWK format)          |
| `GET`  | `/user`                  | Bearer token | Get authenticated user profile       |

## Security

- **JWT (RS256)** — tokens signed with RSA keys stored in `keys/private.key` and `keys/public.key`
- **Password hashing** — bcrypt
- **Login rate limit** — 5 requests per 15 minutes per IP (stored in Redis)
- **Account lockout** — after repeated failed login attempts:
  - 5–9 failures: locked for 5 minutes
  - 10+ failures: locked for 30 minutes

## Technologies

- Node.js
- TypeScript
- Express.js
- Mongoose
- MongoDB
- Redis
- JWT (jsonwebtoken)
- bcryptjs
- express-rate-limit
- Swagger (swagger-ui-express)
- Pino (structured logging)

## Environment variables

| Variable       | Required | Default | Description                                     |
| -------------- | -------- | ------- | ----------------------------------------------- |
| `NODE_ENV`     | Yes      | —       | Environment (`development`, `production`, etc.) |
| `MONGO_DB_URL` | Yes      | —       | MongoDB connection string                       |
| `REDIS_DB_URL` | Yes      | —       | Redis connection string                         |
| `PORT`         | No       | `3333`  | HTTP server port                                |

Example `.env`:

```env
NODE_ENV=development
MONGO_DB_URL=mongodb://localhost:27017/auth-api
REDIS_DB_URL=redis://localhost:6379
PORT=3333
```

## Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start with hot reload (tsx watch)       |
| `npm run build` | Compile TypeScript to `dist/`           |
| `npm start`     | Run compiled app (`node dist/index.js`) |

## How to run

### Prerequisites

- Node.js 18+
- MongoDB instance (local, Docker, or Atlas)
- Redis instance (local or Docker)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — must be **open and running** before using `docker compose` or Docker commands

### Docker (MongoDB + Redis)

Make sure Docker Desktop is running, then start both containers:

```bash
docker compose up -d
```

Start only one service if needed:

```bash
docker compose up -d mongodb
docker compose up -d redis
```

Use these connection strings in `.env`:

```env
MONGO_DB_URL=mongodb://localhost:27017/auth-api
REDIS_DB_URL=redis://localhost:6379
```

**Redis without Docker** — macOS (Homebrew):

```bash
brew install redis
brew services start redis
```

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root (see [Environment variables](#environment-variables)).

3. Generate JWT signing keys (required on first setup):

```bash
mkdir -p keys
openssl genrsa -out keys/private.key 2048
openssl rsa -in keys/private.key -pubout -out keys/public.key
```

### Development

Start the server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3333`.

### Production

Build and run the compiled app:

```bash
npm run build
npm start
```

### Verify

Check that the server is up:

```bash
curl http://localhost:3333/health
```

### Example: login and authenticated request

```bash
# Login
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Use the token from the response
curl http://localhost:3333/user \
  -H "Authorization: Bearer <token>"
```
