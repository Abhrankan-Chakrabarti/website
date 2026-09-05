# API Documentation

This document describes the current production-facing contracts for `lab-api` and `crypto-lab` as they are deployed today.

The service is intentionally small and narrow:

- the Rust application listens only on `127.0.0.1:8088`
- Nginx is the public entry point over HTTPS
- the backend is not directly exposed to the Internet
- `lab-api` provides health, application metadata, Catalan number calculation, and authenticated system snapshot data
- `crypto-lab` provides authenticated hashing and HMAC operations

## Service architecture

```text
Internet
   ↓
HTTPS
   ↓
Nginx
   ↓
/api/*
   ↓
127.0.0.1:8088
   ↓
lab-api
   ↓
systemd
```

The EC2 instance also hosts `crypto-lab` behind the same Nginx HTTPS boundary:

```text
Internet
  ↓
HTTPS
  ↓
Nginx
  ├── /api/*        → 127.0.0.1:8088 → lab-api
  └── /crypto-api/* → 127.0.0.1:8089 → crypto-lab
```

## Public URL vs local backend URL

### Public URL

```text
https://abhrankan.duckdns.org/api/health
https://abhrankan.duckdns.org/api/v1/info
https://abhrankan.duckdns.org/api/v1/catalan/10
https://abhrankan.duckdns.org/api/v1/snapshot
https://abhrankan.duckdns.org/crypto-api/health
https://abhrankan.duckdns.org/crypto-api/v1/info
https://abhrankan.duckdns.org/crypto-api/v1/hash
https://abhrankan.duckdns.org/crypto-api/v1/hmac
https://abhrankan.duckdns.org/crypto-api/v1/hmac/verify
```

These are consumed through Nginx, which terminates TLS and forwards traffic to the backend.

### Local backend URL

```text
http://127.0.0.1:8088/health
http://127.0.0.1:8088/v1/info
http://127.0.0.1:8088/v1/catalan/10
http://127.0.0.1:8088/v1/snapshot
http://127.0.0.1:8089/health
http://127.0.0.1:8089/v1/info
http://127.0.0.1:8089/v1/hash
http://127.0.0.1:8089/v1/hmac
http://127.0.0.1:8089/v1/hmac/verify
```

The backend itself is only accessible from the local machine. It should not be exposed directly on a public interface or a public port.

## Endpoint summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | /api/health | No | Service health |
| GET | /api/v1/info | No | Non-sensitive application metadata and endpoint discovery |
| GET | /api/v1/catalan/:n | No | Catalan number, with `0 ≤ n ≤ 34` |
| GET | /api/v1/snapshot | Basic Auth | Host/system snapshot |

### crypto-lab

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | /crypto-api/health | No | Service health |
| POST | /crypto-api/v1/hash | Basic Auth | SHA-256 or SHA-512 digest |
| POST | /crypto-api/v1/hmac | Basic Auth | HMAC generation |
| POST | /crypto-api/v1/hmac/verify | Basic Auth | Constant-time HMAC verification |

## HTTP status codes

The API uses the standard HTTP responses implied by the handler behavior:

| Status | Meaning |
| --- | --- |
| 200 OK | Successful request |
| 400 Bad Request | Invalid Catalan input such as `n > 34` |
| 401 Unauthorized | Missing or invalid HTTP Basic credentials |
| 404 Not Found | Route not defined |
| 500 Internal Server Error | Unexpected backend failure |

The most important contract checks are:

- `GET /api/health` succeeds with `200`
- `GET /api/v1/info` succeeds with `200` and returns non-sensitive metadata
- `GET /api/v1/catalan/:n` succeeds with `200` when `0 ≤ n ≤ 34`
- `GET /api/v1/catalan/:n` fails with `400` when `n > 34`
- `GET /api/v1/snapshot` fails with `401` without valid Basic Auth

## Application information endpoint

### Route

```http
GET /api/v1/info
```

This public endpoint describes the running application and its public route surface. It does not require authentication and must not expose hostnames, filesystem paths, credentials, environment variables, or system snapshot data.

### Request examples

```bash
curl -sS 'https://abhrankan.duckdns.org/api/v1/info'
curl -sS 'http://127.0.0.1:8088/v1/info'
```

### Response

```json
{
  "service": "lab-api",
  "api": "v1",
  "version": "0.2.0",
  "endpoints": [
    "GET /health",
    "GET /v1/info",
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

`version` is taken from the package version at build time. `build_profile` identifies whether the binary was compiled with debug assertions. `environment` is a deployment label and must remain free of secrets.

## Health endpoint

### Request

```bash
curl -sS https://abhrankan.duckdns.org/api/health
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
GET /api/v1/catalan/:n
```

### Request examples

```bash
curl -sS 'https://abhrankan.duckdns.org/api/v1/catalan/0'
curl -sS 'https://abhrankan.duckdns.org/api/v1/catalan/10'
curl -sS 'https://abhrankan.duckdns.org/api/v1/catalan/34'
```

### Success response

```json
{
  "n": 10,
  "value": "16796"
}
```

The `value` field is the computed Catalan number. The frontend expects exactly this key name and not `catalan`.

### Maximum supported value

The implementation computes Catalan numbers in `u128` and therefore intentionally limits input to:

```text
0 ≤ n ≤ 34
```

This is a deliberate product choice, not a general-purpose arbitrary-precision implementation.

### Out-of-range error

```bash
curl -sS -i 'https://abhrankan.duckdns.org/api/v1/catalan/35'
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
GET /api/v1/snapshot
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
curl -sS -u 'username:password' https://abhrankan.duckdns.org/api/v1/snapshot
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

### Basic Auth behavior

- `GET /api/health` is unauthenticated
- `GET /api/v1/info` is unauthenticated
- `GET /api/v1/catalan/:n` is unauthenticated
- `GET /api/v1/snapshot` requires HTTP Basic Auth

### Auth implementation

The credential check is handled by Nginx, not the Rust application.

This is the desired deployment pattern because:

- the backend remains local-only
- auth is enforced before proxying
- the app does not need to store or validate user credentials
- the public HTTP layer is responsible for access control

### Example Nginx auth block

```nginx
location = /api/v1/snapshot {
    auth_basic "lab-api";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:8088/v1/snapshot;
}
```

This keeps the application simple while allowing Nginx to protect only the snapshot route and leave the public health/info/catalan endpoints open.

## Security model

The current security model is intentionally conservative:

- only localhost binding: `127.0.0.1:8088`
- no public TCP exposure for the Rust process
- HTTPS termination at Nginx
- Basic Auth for the system snapshot endpoint
- no database
- no application-layer user management
- no token system, no OAuth, no session handling

This is a small service with a minimal security boundary. The trust boundary is:

```text
Internet -> HTTPS + Nginx -> local lab-api process -> Linux host
```

The system snapshot endpoint is the only route with protected access. The health, information, and Catalan endpoints are intentionally public and informational.

## Operational notes

- This API is intentionally small and stable.
- No additional endpoints should be added without a matching documentation update.
- The current contract is intentionally deliberate: a health check, public application metadata, a numeric calculation endpoint, and an authenticated snapshot endpoint.
- If the service is extended later, the contract should be updated in this document first.

This is the current canonical API contract for the service.

## crypto-lab API

`crypto-lab` is a separate Rust/Axum service running on `127.0.0.1:8089`. Nginx publishes it under `/crypto-api/`, keeps the health check public, and protects all cryptographic operations with HTTP Basic Authentication.

The repository is available at [foxhackerzdevs/crypto-lab](https://github.com/foxhackerzdevs/crypto-lab).

### Public and local URLs

Public requests use the Nginx prefix:

```text
https://abhrankan.duckdns.org/crypto-api/health
https://abhrankan.duckdns.org/crypto-api/v1/hash
https://abhrankan.duckdns.org/crypto-api/v1/hmac
https://abhrankan.duckdns.org/crypto-api/v1/hmac/verify
```

Local backend requests omit that prefix:

```text
http://127.0.0.1:8089/health
http://127.0.0.1:8089/v1/hash
http://127.0.0.1:8089/v1/hmac
http://127.0.0.1:8089/v1/hmac/verify
```

### Authentication and routing

`GET /crypto-api/health` and `GET /crypto-api/v1/info` are unauthenticated. The hash and HMAC routes require Basic Auth at Nginx:

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
