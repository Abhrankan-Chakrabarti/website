# Lab API Documentation

The Lab API is a small, deliberately minimal service for system health checks, mathematical lookups, and authenticated snapshots. It runs on a private backend and is exposed through Nginx with HTTPS.

## Service Architecture

```
Internet (HTTPS)
    ↓
Nginx (reverse proxy)
    ↓
/api/* → 127.0.0.1:8088
    ↓
lab-api (systemd service)
```

## Authentication

- **Public endpoints**: No authentication required
- **Protected endpoints**: HTTP Basic Authentication
  - Credentials are environment-controlled, not in code
  - Over HTTPS only (enforced by Nginx)

## Endpoints

### `GET /health`

Service health check. No authentication required.

**Request:**
```bash
curl -s https://abhrankan.duckdns.org/api/health
```

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` — Service is running
- `500 Internal Server Error` — Service is down or misconfigured

**Use case:** Monitoring, uptime checks, status pages.

---

### `GET /v1/catalan/:n`

Calculate the nth Catalan number. No authentication required.

**Request:**
```bash
curl -s "https://abhrankan.duckdns.org/api/v1/catalan/5"
```

**Parameters:**
- `n` (path parameter, required): Non-negative integer, `0 ≤ n ≤ 34`

**Response (200 OK):**
```json
{
  "n": 5,
  "catalan": 42
}
```

**Status Codes:**
- `200 OK` — Valid computation completed
- `400 Bad Request` — Invalid or out-of-range `n`
- `500 Internal Server Error` — Server error

**Limitations:**
- Maximum `n = 34` (Catalan numbers grow as $\binom{2n}{n} / (n+1)$; C₃₄ ≈ 1.77 × 10¹⁹, fits in `u128`)
- Negative or non-integer `n` returns `400 Bad Request`
- Input sanitization: only alphanumeric and basic symbols

**Examples:**
```bash
# Valid request
curl -s "https://abhrankan.duckdns.org/api/v1/catalan/0"
→ {"n":0,"catalan":1}

# Out of range
curl -s "https://abhrankan.duckdns.org/api/v1/catalan/100"
→ 400 Bad Request

# Invalid input
curl -s "https://abhrankan.duckdns.org/api/v1/catalan/abc"
→ 400 Bad Request
```

**Use case:** Educational demonstrations, algorithm exploration, API testing.

---

### `GET /v1/info`

Return non-sensitive application metadata for discovery. No authentication required.

**Request:**
```bash
curl -s "https://abhrankan.duckdns.org/api/v1/info"
```

**Response (200 OK):**
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

**Status Codes:**
- `200 OK` — Metadata returned
- `500 Internal Server Error` — Server error

The response must contain application metadata only. It must not expose credentials,
hostnames, filesystem paths, environment variables, private addresses, or system
snapshot data. The `environment` value identifies the build/runtime profile and must
not contain deployment secrets.

**Use case:** Client discovery, diagnostics, and displaying the service contract in
the Lab frontend.

---

### `GET /v1/snapshot`

Authenticated system/service snapshot. **Requires HTTP Basic Auth**.

**Request:**
```bash
curl -s -u "username:password" \
  "https://abhrankan.duckdns.org/api/v1/snapshot"
```

**Response (200 OK):**
```json
{
  "timestamp": "2026-08-29T14:23:45Z",
  "hostname": "lab-host",
  "uptime": 1234567,
  "memory": {
    "total": 1073741824,
    "available": 536870912
  },
  "services": {
    "nginx": "running",
    "lab-api": "running"
  }
}
```

**Status Codes:**
- `200 OK` — Valid credentials, snapshot returned
- `401 Unauthorized` — Missing or invalid credentials
- `403 Forbidden` — Credentials valid but insufficient permissions
- `500 Internal Server Error` — Server error

**Authentication Behavior:**
- Credentials must be passed in the `Authorization` header as Base64-encoded `username:password`
- Invalid credentials return `401` with a `WWW-Authenticate` challenge
- Credentials are never logged (except via audit trails if configured)
- HTTPS is required; HTTP requests are rejected by Nginx

**Example with curl:**
```bash
# Using -u flag (curl encodes automatically)
curl -s -u "alice:secret" \
  "https://abhrankan.duckdns.org/api/v1/snapshot"

# Manual Base64 encoding
curl -s -H "Authorization: Basic YWxpY2U6c2VjcmV0" \
  "https://abhrankan.duckdns.org/api/v1/snapshot"
```

**Use case:** Private monitoring dashboards, authenticated status views, deployment verification.

---

## HTTP Status Codes Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid parameter, out of range, malformed input |
| 401 | Unauthorized | Missing or invalid authentication credentials |
| 403 | Forbidden | Valid credentials but insufficient permissions |
| 404 | Not Found | Endpoint does not exist |
| 500 | Internal Server Error | Server-side failure, service down |

---

## Deployment & Infrastructure

### Systemd Service

The lab-api runs as a systemd service on the backend host:

```bash
# Check status
systemctl status lab-api

# Restart
sudo systemctl restart lab-api

# View logs
journalctl -u lab-api -f
```

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
