# nestjs-postgresql

A [NestJS](https://nestjs.com/) 11 backend service with PostgreSQL (TypeORM), JWT authentication, environment-based configuration, and Swagger API documentation.

## Tech Stack

- [NestJS 11](https://nestjs.com/) — application framework
- [TypeORM](https://typeorm.io/) + [PostgreSQL](https://www.postgresql.org/) — data persistence (`pg` driver)
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) — `.env` based configuration
- [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) — OpenAPI documentation at `/docs`
- [@nestjs/jwt](https://docs.nestjs.com/security/authentication) + [@nestjs/passport](https://docs.nestjs.com/security/authentication) — JWT-based authentication with Passport
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password hashing

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or reachable via env vars)

## Project setup

```bash
$ npm install
```

## Environment configuration

Copy or create a `.env` file in the project root with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=dzservice
PORT=3000
JWT_SECRET=your-secret-key-here
```

All variables are optional — sensible defaults are applied for the database connection; the server listens on port `3000` unless `PORT` is set. **`JWT_SECRET` is required for authentication** — the app will fail to sign/verify tokens without it.

### Database tables

Entity synchronization is disabled. Create the required tables with:

```sql
CREATE TABLE "test" (
  "id" bigint PRIMARY KEY,
  "name" varchar(5)
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "account" varchar(50) NOT NULL,
  "name" varchar(50),
  "email" varchar(50),
  "pwd" varchar(200) NOT NULL,
  "isactive" bit,
  "roleid" bigint,
  "createddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "devices" (
  "id" SERIAL PRIMARY KEY,
  "code" varchar(50),
  "name" varchar(50),
  "devicetype" varchar(20),
  "params" varchar(200),
  "lat" numeric(9,6),
  "lng" numeric(9,6),
  "isactive" bit,
  "status" varchar(20),
  "createddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50),
  "createddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateddate" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "roledevices" (
  "roleid" bigint NOT NULL REFERENCES "roles"("id"),
  "deviceid" bigint NOT NULL REFERENCES "devices"("id"),
  PRIMARY KEY ("roleid", "deviceid")
);
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run build && npm run start:prod
```

## API endpoints

### Authentication

| Method | Path                      | Description                                           | Auth |
| ------ | ------------------------- | ----------------------------------------------------- | ---- |
| POST   | `/auth/token`             | Login — returns JWT access token                      | No   |
| POST   | `/auth/hashpwd/:password` | Hash a password with bcrypt (utility endpoint)        | No   |

**Using the token:** Pass the returned `access_token` as a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

All endpoints except those marked `@Public()` require a valid JWT token.

### App

| Method | Path                | Description                                    | Auth |
| ------ | ------------------- | ---------------------------------------------- | ---- |
| GET    | `/`                 | Greeting message                               | Yes  |
| GET    | `/api/hello?name=`  | Personalized greeting (defaults to `World`)    | Yes  |

### Users

| Method | Path         | Description                                       | Auth |
| ------ | ------------ | ------------------------------------------------- | ---- |
| POST   | `/users`     | Create a new user (`account` and `pwd` required)  | Yes  |
| GET    | `/users`     | List all users (ordered by id ascending)          | Yes  |
| GET    | `/users/:id` | Get a user by id                                  | Yes  |
| PATCH  | `/users/:id` | Update a user                                     | Yes  |
| DELETE | `/users/:id` | Delete a user                                     | Yes  |

#### User fields

| Field       | Type     | Notes                              |
| ----------- | -------- | ---------------------------------- |
| `id`        | number   | Auto-generated primary key         |
| `account`   | string   | Required, max 50 chars             |
| `pwd`       | string   | Required, max 200 chars (bcrypt)   |
| `name`      | string   | Optional, max 50 chars             |
| `email`     | string   | Optional, max 50 chars             |
| `isactive`  | bit      | Optional, active flag              |
| `roleid`    | bigint   | Optional, role reference           |
| `createddate` | timestamptz | Auto-set on create             |
| `updateddate` | timestamptz | Auto-set on update             |

### Devices

| Method | Path         | Description                                         | Auth |
| ------ | ------------ | --------------------------------------------------- | ---- |
| POST   | `/devices`   | Create a new device                                 | Yes  |
| GET    | `/devices`   | List devices (paginated, searchable, filterable)    | Yes  |
| GET    | `/devices/:id` | Get a device by id                               | Yes  |
| PATCH  | `/devices/:id` | Update a device                                  | Yes  |
| DELETE | `/devices/:id` | Delete a device                                  | Yes  |

#### GET /devices query parameters

| Parameter  | Type   | Default | Description                                                  |
| ---------- | ------ | ------- | ------------------------------------------------------------ |
| `page`     | number | 1       | Page number (minimum 1)                                      |
| `pageSize` | number | 20      | Items per page (1–200)                                       |
| `sort`     | string | `id`    | Sort field: `id`, `code`, or `name`                          |
| `order`    | string | `ASC`   | Sort direction: `ASC` or `DESC`                              |
| `q`        | string | —       | General search term (searches `code` and `name`)             |
| `code`     | string | —       | Search by device code                                        |
| `name`     | string | —       | Search by device name                                        |
| `status`   | string | —       | Filter by device status                                      |
| `isactive` | string | —       | Filter by active flag                                        |
| `devicetype`| string | —      | Filter by device type                                        |

**Example:**

```
GET /devices?page=1&pageSize=10&sort=name&order=ASC&status=active
```

**Response:**

```json
{
  "rows": [{ "id": 1, "code": "cctv-n1", "name": "autobahn", ... }],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

#### Device fields

| Field        | Type     | Notes                        |
| ------------ | -------- | ---------------------------- |
| `id`         | number   | Auto-generated primary key   |
| `code`       | string   | Optional, max 50 chars       |
| `name`       | string   | Optional, max 50 chars       |
| `devicetype` | string   | Optional, max 20 chars       |
| `params`     | string   | Optional, max 200 chars      |
| `lat`        | number   | Optional, latitude (9,6)     |
| `lng`        | number   | Optional, longitude (9,6)    |
| `isactive`   | bit      | Optional, active flag        |
| `status`     | string   | Optional, device status      |
| `createddate` | timestamptz | Auto-set on create       |
| `updateddate` | timestamptz | Auto-set on update       |

### Roles

| Method | Path       | Description                                | Auth |
| ------ | ---------- | ------------------------------------------ | ---- |
| POST   | `/roles`   | Create a role (with optional device ids)   | Yes  |
| GET    | `/roles`   | List all roles (includes associated devices) | Yes |
| GET    | `/roles/:id` | Get a role by id                        | Yes  |
| PATCH  | `/roles/:id` | Update a role                           | Yes  |
| DELETE | `/roles/:id` | Delete a role                           | Yes  |

#### Role fields

| Field       | Type     | Notes                              |
| ----------- | -------- | ---------------------------------- |
| `id`        | number   | Auto-generated primary key         |
| `name`      | string   | Optional, max 50 chars             |
| `devices`   | Device[] | Many-to-many relationship          |
| `createddate` | timestamptz | Auto-set on create             |
| `updateddate` | timestamptz | Auto-set on update             |

Interactive API documentation (Swagger UI) is available at [http://localhost:3000/docs](http://localhost:3000/docs), including bearer auth support. Click the **Authorize** button in Swagger UI to enter your JWT token for testing protected endpoints.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Lint and format

```bash
$ npm run lint
$ npm run format
```

## Project structure

```
src/
  main.ts             # Bootstrap + Swagger setup
  app.module.ts       # Root module (Config, TypeORM, Auth, Users, Devices, Roles, Test)
  app.controller.ts   # GET /
  app.service.ts
  hello.controller.ts # GET /api/hello
auth/
  auth.module.ts      # JWT authentication module
  auth.controller.ts  # POST /auth/token, POST /auth/hashpwd
  auth.service.ts     # Login, password hashing, user lookup
  auth.strategy.ts    # Passport JWT strategy
  auth.check.ts       # Global JWT guard with @Public() bypass
  auth.dto.ts         # AuthLoginDto, AuthTokenDto
  auth.public.ts      # @Public() decorator
users/
  user.module.ts      # Users feature module
  user.entity.ts      # "users" table entity
  user.controller.ts  # CRUD endpoints (/users)
  user.service.ts     # User business logic
devices/
  device.module.ts    # Devices feature module
  device.entity.ts    # "devices" table entity
  device.controller.ts # CRUD endpoints (/devices)
  device.service.ts   # Device business logic
common/
  paging/
    page.module.ts    # Global paging module (auto-available everywhere)
    page.service.ts   # PagingService — search, filter, sort orchestration
    page.decorator.ts # @Page() param decorator (parses query string)
    paginate.ts       # Core pagination logic (TypeORM QueryBuilder)
    api-page-queries.ts # Swagger decorator for paging query params
roles/
  role.module.ts      # Roles feature module
  role.entity.ts      # "roles" table entity (ManyToMany with Device)
  role.controller.ts  # CRUD endpoints (/roles)
  role.service.ts     # Role business logic
test/
  test.module.ts      # Example feature module (entity + service + controller)
  test.entity.ts      # "test" table entity
  test.controller.ts
  test.service.ts
  app.e2e-spec.ts     # End-to-end tests
```
