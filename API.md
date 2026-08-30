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
    "GET /api/health",
    "GET /api/v1/info",
    "GET /api/v1/catalan/:n",
    "GET /api/v1/snapshot"
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
location /api/ {
    auth_basic "lab-api";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:8088/;
}
```

This keeps the application simple while allowing Nginx to handle TLS and access control at the public edge.

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

---

### Nginx Configuration

Nginx reverse-proxies all `/api/*` requests to the backend:

```nginx
upstream lab_api {
    server 127.0.0.1:8088;
}

server {
    listen 443 ssl http2;
    server_name abhrankan.duckdns.org;

    ssl_certificate     /path/to/cert;
    ssl_certificate_key /path/to/key;

    location /api/ {
        proxy_pass http://lab_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Security Model

- **Network isolation**: Lab API only listens on `127.0.0.1:8088` (no public access)
- **HTTPS enforcement**: Nginx enforces SSL/TLS; HTTP is redirected or rejected
- **Authentication**: Basic Auth over HTTPS only
- **Rate limiting**: Nginx can be configured with rate limits (not currently enforced)
- **CORS**: Not applicable (backend is private)
- **Input validation**: All parameters are sanitized before processing

---

## Rate Limiting & Quotas

Currently, no rate limiting is enforced. Recommended production settings:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://lab_api/;
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-08-29T14:23:45Z"
}
```

**Example:**
```bash
curl -s "https://abhrankan.duckdns.org/api/v1/catalan/invalid"
→ 400 Bad Request
→ {"error":"Invalid parameter: n must be a non-negative integer","code":"INVALID_PARAMETER","timestamp":"2026-08-29T14:24:10Z"}
```

---

## Examples

### Health Check Monitoring

```bash
#!/bin/bash
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://abhrankan.duckdns.org/api/health")
  if [ "$response" != "200" ]; then
    echo "ALERT: Health check failed ($response)"
  fi
  sleep 60
done
```

### Catalan Number Batch Lookup

```bash
for n in {0..10}; do
  result=$(curl -s "https://abhrankan.duckdns.org/api/v1/catalan/$n" | jq .catalan)
  echo "C($n) = $result"
done
```

### Authenticated Snapshot Retrieval

```bash
snapshot=$(curl -s -u "$SNAPSHOT_USER:$SNAPSHOT_PASS" \
  "https://abhrankan.duckdns.org/api/v1/snapshot")
echo "$snapshot" | jq '.services'
```

---

## Limits & Constraints

- **Catalan computation**: Max `n = 34` (u128 limit)
- **Request timeout**: 30 seconds (Nginx default)
- **Payload size**: 1 MB (Nginx default)
- **Connection limit**: Unlimited (Nginx default)
- **Backend capacity**: Single-threaded, ~100 req/sec sustained

---

## Support & Feedback

For bugs, feature requests, or documentation improvements, open an issue on [GitHub](https://github.com/Abhrankan-Chakrabarti/website).

---

**Last updated**: August 29, 2026  
**API Version**: v1.0.0  
**Status**: Stable & production-ready
