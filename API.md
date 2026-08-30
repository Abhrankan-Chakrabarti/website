# Lab API Documentation

This document describes the current production-facing contract for `lab-api` as it is deployed today.

The service is intentionally small and narrow:

- the Rust application listens only on `127.0.0.1:8088`
- Nginx is the public entry point over HTTPS
- the backend is not directly exposed to the Internet
- the public API is limited to health, application metadata, Catalan number calculation, and authenticated system snapshot data

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

## Public URL vs local backend URL

### Public URL

```text
https://abhrankan.duckdns.org/api/health
https://abhrankan.duckdns.org/api/v1/info
https://abhrankan.duckdns.org/api/v1/catalan/10
https://abhrankan.duckdns.org/api/v1/snapshot
```

These are consumed through Nginx, which terminates TLS and forwards traffic to the backend.

### Local backend URL

```text
http://127.0.0.1:8088/health
http://127.0.0.1:8088/v1/info
http://127.0.0.1:8088/v1/catalan/10
http://127.0.0.1:8088/v1/snapshot
```

The backend itself is only accessible from the local machine. It should not be exposed directly on a public interface or a public port.

## Endpoint summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | /api/health | No | Service health |
| GET | /api/v1/info | No | Non-sensitive application metadata and endpoint discovery |
| GET | /api/v1/catalan/:n | No | Catalan number, with `0 ≤ n ≤ 34` |
| GET | /api/v1/snapshot | Basic Auth | Host/system snapshot |

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
