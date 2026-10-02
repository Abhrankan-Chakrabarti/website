# API contracts: lab-api and crypto-lab

This document describes the current production-facing contracts for `lab-api` and `crypto-lab` as deployed today.

The service is intentionally small and intentionally narrow:

- the Rust application listens only on `127.0.0.1:8088`
- Nginx is the public entry point over HTTPS
- the backend is not directly exposed to the Internet
- the core `/api/*` service provides health, application metadata, read-only mathematical calculations, and an authenticated system snapshot; it does not use a database
- the separate `/school/*` surface is a read-only SQLite API configured by `SCHOOL_DB_PATH`
- in production, the entire `/school/` location is protected by Nginx HTTP Basic Authentication

## Service architecture

```text
Internet
   ↓
HTTPS
   ↓
Nginx
  ├── /api/* and /school/* → 127.0.0.1:8088 → lab-api → systemd
  └── /crypto-api/*        → 127.0.0.1:8089 → crypto-lab → systemd
```

## Public URL vs local backend URL

### Public URL

```text
https://example.com/api/health
https://example.com/api/v1/info
https://example.com/api/v1/catalan/10
https://example.com/api/v1/math/catalan/10
https://example.com/api/v1/math/fibonacci/10
https://example.com/api/v1/math/gcd/84/30
https://example.com/api/v1/snapshot
https://example.com/school/api/tables/II_A/students/1001
https://example.com/school/api/admin/tables/II_A/students/1001
```

These are consumed through Nginx, which terminates TLS and forwards traffic to the backend.

### Local backend URL

```text
http://127.0.0.1:8088/health
http://127.0.0.1:8088/v1/info
http://127.0.0.1:8088/v1/catalan/10
http://127.0.0.1:8088/v1/math/catalan/10
http://127.0.0.1:8088/v1/math/fibonacci/10
http://127.0.0.1:8088/v1/math/gcd/84/30
http://127.0.0.1:8088/v1/snapshot
http://127.0.0.1:8088/school/api/tables/II_A/students/1001
http://127.0.0.1:8088/school/api/admin/tables/II_A/students/1001
```

The backend itself is only accessible from the local machine. It should not be exposed directly on a public interface or a public port.

## Endpoint summary

The routes in this table are **backend** paths. Public clients prefix core routes with `/api`. School routes are published under `/school` with the same path after that prefix.

| Method | Endpoint | Auth (public edge) | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | None | Service health |
| GET | `/v1/info` | None | Non-sensitive application metadata and endpoint discovery |
| GET | `/v1/math/catalan/:n` | None | Catalan number, `0 ≤ n ≤ 34` |
| GET | `/v1/math/fibonacci/:n` | None | Fibonacci number, `0 ≤ n ≤ 186` |
| GET | `/v1/math/gcd/:a/:b` | None | Greatest common divisor of two `u64` values |
| GET | `/v1/catalan/:n` | None | Catalan number, compatibility alias, `0 ≤ n ≤ 34` |
| GET | `/v1/snapshot` | Nginx Basic Auth | Host/system snapshot |
| GET | `/school/api/tables/{table}/students/{student_id}` | Nginx Basic Auth | Privacy-filtered student detail |
| GET | `/school/api/admin/tables/{table}/students/{student_id}` | Nginx Basic Auth + admin allowlist | Full student detail |

`{table}` is a discovered class table name (for example `II_A`, `LPP`). `{student_id}` is the table’s primary-key value (for example `Student Code` or `Roll No`), not a nested path segment named `students`.

## School API

The core `/api/*` service does not use a database. The separate School API under `/school/` reads SQLite from `SCHOOL_DB_PATH` and is read-only during normal runtime.

In production, **Nginx Basic Authentication applies to the entire `/school/` location** (UI and API). The Rust process assumes that gate for Internet traffic. Admin full-detail adds an application allowlist on top of that.

### Safe student detail

```http
GET /school/api/tables/{table}/students/{student_id}
```

Example:

```http
GET /school/api/tables/II_A/students/1001
```

This endpoint excludes explicitly sensitive contact, financial, and identity fields.

### Admin full student detail

```http
GET /school/api/admin/tables/{table}/students/{student_id}
```

Example:

```http
GET /school/api/admin/tables/II_A/students/1001
```

The admin endpoint returns every column discovered from the selected table schema. It requires both:

1. Nginx Basic Authentication for the `/school/` location.
2. The authenticated username in the backend `X-Authenticated-User` header and in `LAB_API_ADMIN_USERS`.

Configure the backend with a comma-separated allowlist, for example:

```text
LAB_API_ADMIN_USERS=abhrankan,teacher1,principal
```

Missing authentication at Nginx yields **401 Unauthorized**.  
Authenticated but non-admin (or missing `X-Authenticated-User`) yields **403 Forbidden**:

```json
{
  "error": "admin access required"
}
```

The backend listens only on `127.0.0.1:8088`, so the authenticated identity header is intended to be supplied by the local Nginx reverse proxy rather than by an Internet client. Nginx should set it inside the authenticated `/school/` location:

```nginx
location /school/ {
    auth_basic "School Database";
    auth_basic_user_file /etc/nginx/school.htpasswd;

    proxy_pass http://127.0.0.1:8088;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Authenticated-User $remote_user;
}
```

Do not expose the backend directly on a public interface.

## HTTP status codes

| Status | Meaning |
| --- | --- |
| 200 OK | Successful request |
| 400 Bad Request | Invalid Catalan input (`n > 34`) or Fibonacci input (`n > 186`) |
| 401 Unauthorized | Missing or invalid HTTP Basic credentials at Nginx |
| 403 Forbidden | Authenticated School user is not on the admin allowlist (admin detail only) |
| 404 Not Found | Route not defined, or unknown table/student |
| 500 Internal Server Error | Unexpected backend failure |

The most important contract checks are:

- `GET /health` succeeds with `200`
- `GET /v1/info` succeeds with `200` and returns non-sensitive metadata
- `GET /v1/math/catalan/:n` succeeds with `200` when `0 ≤ n ≤ 34`
- `GET /v1/math/fibonacci/:n` succeeds with `200` when `0 ≤ n ≤ 186`
- `GET /v1/math/gcd/:a/:b` succeeds with `200` for valid `u64` path values
- `GET /v1/catalan/:n` remains available as a compatibility alias
- `GET /v1/catalan/:n` fails with `400` when `n > 34`
- `GET /v1/math/fibonacci/:n` fails with `400` when `n > 186`
- `GET /v1/snapshot` fails with `401` without valid Basic Auth
- `GET /school/...` fails with `401` without valid Basic Auth at the public edge
- `GET /school/api/admin/...` fails with `403` for non-admin users

## Math endpoints

The math endpoints are public, read-only GET routes. They use `u128` arithmetic where applicable and return numeric values as strings to preserve the exact result in JSON clients.

### Catalan

```http
GET /v1/math/catalan/:n
```

Supports `0 ≤ n ≤ 34`. The existing `GET /v1/catalan/:n` route is retained as a compatibility alias with the same response and limit.

### Fibonacci

```http
GET /v1/math/fibonacci/:n
```

Supports `0 ≤ n ≤ 186`. `F(186)` is the largest Fibonacci value representable by the implementation’s `u128` boundary; `n = 187` returns `400 Bad Request`.

Example response:

```json
{
  "n": 10,
  "value": "55"
}
```

### Greatest common divisor

```http
GET /v1/math/gcd/:a/:b
```

Computes the GCD of two `u64` path values using the Euclidean algorithm. Zero is valid, including `gcd(0, 0) = 0`.

```bash
curl -sS 'https://example.com/api/v1/math/gcd/84/30'
curl -sS 'https://example.com/api/v1/math/fibonacci/10'
```

```json
{
  "a": 84,
  "b": 30,
  "gcd": 6
}
```

## Application information endpoint

### Route

```http
GET /v1/info
```

This public endpoint describes the running application and its public route surface. It does not require authentication and must not expose hostnames, filesystem paths, credentials, secret environment variables, or system snapshot data. The `environment` field is only a non-secret deployment label.

### Request examples

```bash
curl -sS 'https://example.com/api/v1/info'
curl -sS 'http://127.0.0.1:8088/v1/info'
```

### Response

```json
{
  "service": "lab-api",
  "api_version": "v1",
  "app_version": "0.7.1",
  "endpoints": [
    "GET /health",
    "GET /v1/info",
    "GET /v1/math/catalan/:n",
    "GET /v1/math/fibonacci/:n",
    "GET /v1/math/gcd/:a/:b",
    "GET /v1/catalan/:n",
    "GET /v1/snapshot"
  ],
  "build_profile": "release",
  "environment": "production"
}
```

### Status

- `200 OK` — Metadata returned
- `500 Internal Server Error` — Unexpected backend failure

`app_version` is taken from the package version at build time. `build_profile` identifies whether the binary was compiled with debug assertions. `environment` is an optional `LAB_API_ENV` deployment label, defaults to `unknown`, and must remain free of secrets.

## Health endpoint

### Request

```bash
curl -sS https://example.com/api/health
```

### Response

```json
{
  "ok": true,
  "service": "lab-api"
}
```

### Local backend example

```bash
curl -sS http://127.0.0.1:8088/health
```

### Status

- `200 OK`
- No authentication required

This endpoint is intended to remain publicly readable for simple service checks and monitoring.

## Catalan number endpoint

### Route

```http
GET /v1/catalan/:n
```

### Request examples

```bash
curl -sS 'https://example.com/api/v1/catalan/0'
curl -sS 'https://example.com/api/v1/catalan/10'
curl -sS 'https://example.com/api/v1/catalan/34'
```

### Success response

```json
{
  "n": 10,
  "value": "16796"
}
```

### Maximum supported value

The implementation computes Catalan numbers in `u128` and therefore intentionally limits input to:

```text
0 ≤ n ≤ 34
```

This is a deliberate product choice, not a general-purpose arbitrary-precision implementation.

The calculation uses the standard recurrence:

```text
C(0) = 1
C(n) = C(n-1) * 2 * (2n - 1) / (n + 1)
```

### Out-of-range error

```bash
curl -sS -i 'https://example.com/api/v1/catalan/35'
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "n must be <= 34 for this demo (u128 limit)"
}
```

### Status

- `200 OK` when `0 ≤ n ≤ 34`
- `400 Bad Request` when `n > 34`
- no authentication required

## Snapshot endpoint

### Route

```http
GET /v1/snapshot
```

This endpoint provides a minimal system summary from the host running `lab-api`.

### Example response

```json
{
  "hostname": "ip-172-31-77-184.ec2.internal",
  "uptime": "up 2 days, 2 hours, 52 minutes",
  "loadavg": "0.13 0.15 0.13",
  "mem_available_kb": 580200
}
```

### Data collected

- hostname
- system uptime
- 1, 5, and 15 minute load averages
- available memory in KiB

### Request example

```bash
curl -sS -u 'username:password' https://example.com/api/v1/snapshot
```

### Local backend example

```bash
curl -sS -u 'username:password' http://127.0.0.1:8088/v1/snapshot
```

### Authentication behavior

The snapshot endpoint is protected by Nginx HTTP Basic Authentication.

The Rust application itself does not enforce credentials for this route. Authentication is enforced at the public entry point before traffic reaches the backend.

If the client omits credentials or provides invalid credentials, the response is:

```http
HTTP/1.1 401 Unauthorized
```

This is intentional. The endpoint exposes host-level information and is therefore treated as sensitive.

## Authentication model

### Core `/api/*` (public edge)

- `GET /health` — unauthenticated
- `GET /v1/info` — unauthenticated
- `GET /v1/math/catalan/:n` — unauthenticated
- `GET /v1/math/fibonacci/:n` — unauthenticated
- `GET /v1/math/gcd/:a/:b` — unauthenticated
- `GET /v1/catalan/:n` — unauthenticated
- `GET /v1/snapshot` — Nginx HTTP Basic Auth

### School `/school/*` (public edge)

- All `/school/` paths — Nginx HTTP Basic Auth
- `GET /school/api/admin/...` — Nginx HTTP Basic Auth **and** username in `LAB_API_ADMIN_USERS` via `X-Authenticated-User`

### Auth implementation

For `/v1/snapshot`, Nginx enforces HTTP Basic Authentication before proxying; the core Rust handler does not validate those credentials.

For School, Nginx authenticates the whole `/school/` tree and forwards `$remote_user` as `X-Authenticated-User`. The admin full-detail handler additionally checks that value against `LAB_API_ADMIN_USERS`.

Do not expose port `8088` publicly: without Nginx, School routes would not have the edge Basic Auth gate.

### Example Nginx blocks

```nginx
# Public core API (no auth)
location /api/ {
    proxy_pass http://127.0.0.1:8088/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Snapshot only
location = /api/v1/snapshot {
    auth_basic "Private API";
    auth_basic_user_file /etc/nginx/status.htpasswd;
    proxy_pass http://127.0.0.1:8088/v1/snapshot;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Entire School tree
location /school/ {
    auth_basic "School Database";
    auth_basic_user_file /etc/nginx/school.htpasswd;
    proxy_pass http://127.0.0.1:8088;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Authenticated-User $remote_user;
}
```

Exact matches for `/api/v1/snapshot` take precedence over the `/api/` prefix. Health, info, math, and the Catalan alias remain public.

## Nginx routing

```text
https://example.com/api/...     →  http://127.0.0.1:8088/...
https://example.com/school/...  →  http://127.0.0.1:8088/school/...
```

Examples:

```text
https://example.com/api/health
  → http://127.0.0.1:8088/health

https://example.com/api/v1/catalan/10
  → http://127.0.0.1:8088/v1/catalan/10

https://example.com/api/v1/info
  → http://127.0.0.1:8088/v1/info

https://example.com/school/api/tables/II_A/students/1001
  → http://127.0.0.1:8088/school/api/tables/II_A/students/1001
```

## Security model

- only localhost binding: `127.0.0.1:8088`
- no public TCP exposure for the Rust process
- HTTPS termination at Nginx
- Basic Auth for `/api/v1/snapshot`
- Basic Auth for the entire `/school/` tree
- admin allowlist for full School student detail
- no database for the core `/api/*` service
- School SQLite via `SCHOOL_DB_PATH`, read-only at runtime
- no token system, OAuth, or general session framework

## crypto-lab API

`crypto-lab` is a separate Rust/Axum service running on `127.0.0.1:8089`. Nginx publishes it under `/crypto-api/`, keeps the health and information endpoints public, and protects all cryptographic operations with HTTP Basic Authentication.

The repository is available at [foxhackerzdevs/crypto-lab](https://github.com/foxhackerzdevs/crypto-lab).

### Public and local URLs

Public requests use the Nginx prefix:

```text
https://abhrankan.duckdns.org/crypto-api/health
https://abhrankan.duckdns.org/crypto-api/v1/info
https://abhrankan.duckdns.org/crypto-api/v1/hash
https://abhrankan.duckdns.org/crypto-api/v1/hmac
https://abhrankan.duckdns.org/crypto-api/v1/hmac/verify
```

Local backend requests omit that prefix:

```text
http://127.0.0.1:8089/health
http://127.0.0.1:8089/v1/info
http://127.0.0.1:8089/v1/hash
http://127.0.0.1:8089/v1/hmac
http://127.0.0.1:8089/v1/hmac/verify
```

### Authentication and routing

`GET /crypto-api/health` and `GET /crypto-api/v1/info` are unauthenticated. The hash and HMAC routes require Basic Auth at Nginx:

The htpasswd path below is an example; use the credential-file path configured by your Nginx site.

```nginx
location = /crypto-api/health {
    proxy_pass http://127.0.0.1:8089/health;
}

location = /crypto-api/v1/info {
    proxy_pass http://127.0.0.1:8089/v1/info;
}

location /crypto-api/ {
    auth_basic "crypto-lab";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:8089/;
}
```

The exact health and info matches prevent the public endpoints from inheriting the operation credentials. The trailing slash on the authenticated location maps `/crypto-api/v1/hash` to `/v1/hash` on the backend.

### Application information

```bash
curl -sS https://abhrankan.duckdns.org/crypto-api/v1/info
```

Response:

```json
{
  "service": "crypto-lab",
  "api": "v1",
  "version": "0.1.0",
  "endpoints": [
    "GET /health",
    "GET /v1/info",
    "POST /v1/hash",
    "POST /v1/hmac",
    "POST /v1/hmac/verify"
  ],
  "build_profile": "release",
  "environment": "production"
}
```

This endpoint returns non-sensitive application metadata and does not require authentication. `environment` comes from the optional `LAB_API_ENV` deployment label and defaults to `unknown`; it must remain free of secrets.

### Hash

```bash
curl -sS -u 'username:password' \
    -H 'Content-Type: application/json' \
    -d '{"algorithm":"sha256","data":"hello"}' \
    https://abhrankan.duckdns.org/crypto-api/v1/hash
```

Response:

```json
{
  "algorithm": "sha256",
  "digest": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

### HMAC generation

```bash
curl -sS -u 'username:password' \
    -H 'Content-Type: application/json' \
    -d '{"algorithm":"sha256","key":"secret","data":"message"}' \
    https://abhrankan.duckdns.org/crypto-api/v1/hmac
```

Response:

```json
{
  "algorithm": "sha256",
  "mac": "8b5f48702995c1598c573db1e21866a9b825d4a794d169d7060a03605796360b"
}
```

### HMAC verification

```bash
curl -sS -u 'username:password' \
    -H 'Content-Type: application/json' \
    -d '{"algorithm":"sha256","key":"secret","data":"message","mac":"8b5f48702995c1598c573db1e21866a9b825d4a794d169d7060a03605796360b"}' \
    https://abhrankan.duckdns.org/crypto-api/v1/hmac/verify
```

Response:

```json
{
  "algorithm": "sha256",
  "valid": true
}
```

Malformed hexadecimal MAC input returns `400 Bad Request`. A well-formed but incorrect MAC returns `200 OK` with `"valid": false`.

### Input contract and status codes

- Supported algorithms are exactly `sha256` and `sha512`.
- All operation requests require `Content-Type: application/json`.
- Text fields are interpreted as UTF-8 and operations use their UTF-8 byte representation.
- Binary input and base64 encoding are outside the current contract.
- Request bodies are limited to 64 KiB.
- Each textual input (`data`, `key`, and `mac`) is limited to 32 KiB.
- `200 OK` indicates a successful operation.
- `400 Bad Request` indicates an unsupported algorithm or malformed MAC.
- `401 Unauthorized` indicates missing or invalid Basic Auth at Nginx.
- `413 Payload Too Large` indicates a body or textual input limit was exceeded.
- `415 Unsupported Media Type` indicates a non-JSON operation request.
- `404 Not Found` indicates an undefined route.

### Security boundary

`crypto-lab` binds only to `127.0.0.1:8089`. Nginx terminates HTTPS and protects cryptographic operations before proxying to the service. The service does not store keys, persist requests, or provide wallets, mining, exchange, payment, or key-management functionality. Do not send production private keys or long-lived secrets to it.

The service is supervised by systemd with `ProtectSystem=strict`, `ProtectHome`, `PrivateTmp`, namespace restrictions, and kernel protection settings.
