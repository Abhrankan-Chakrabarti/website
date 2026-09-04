# Releases

## [v0.2.0] — 2026-08-30

### Added
- Added public `GET /api/v1/info` for non-sensitive service metadata and endpoint discovery.
- Added an API information panel to the Lab frontend.

### Backend
- Reports service name, API version, package version, route list, build profile, and environment label.
- Keeps the existing authentication model unchanged; only `/api/v1/snapshot` remains protected.
- No new infrastructure or separate service added.

## [v0.1.0] — 2026-08-29

**Initial release of `crypto-lab`, a small self-hosted Rust cryptography API.**

### Added
- SHA-256 hashing endpoint.
- SHA-512 hashing endpoint.
- HMAC-SHA256 generation.
- HMAC-SHA512 generation.
- Constant-time HMAC verification.
- Public health endpoint.
- JSON-based HTTP API built with Axum and Tokio.
- Input and request body size limits.
- Production-oriented systemd service configuration.
- Nginx reverse-proxy deployment under `/crypto-api/`.

### API
- `GET /health`
- `POST /v1/hash`
- `POST /v1/hmac`
- `POST /v1/hmac/verify`

### Security
- HMAC verification uses constant-time comparison.
- Crypto operations are protected by Nginx Basic Authentication.
- The service binds only to `127.0.0.1:8089`.
- Request bodies are limited to 64 KiB.
- Individual textual inputs are limited to 32 KiB.
- No private key storage, wallet functionality, payment processing, or other credential-management features are included.

### Infrastructure
- Runs as a dedicated systemd service.
- Exposed through the existing Nginx HTTPS endpoint.
- Reuses the existing authentication configuration.
- Requires no database, queue, container stack, or additional monitoring infrastructure.

### Status
- ✅ SHA-256/SHA-512 hashing
- ✅ HMAC generation and verification
- ✅ Constant-time verification
- ✅ Request size limits
- ✅ Systemd deployment
- ✅ Nginx HTTPS integration
- 🔒 v0.1.0 scope frozen

**`crypto-lab` is intentionally minimal and focused on cryptographic hashing and HMAC experimentation.**

## [v1.0.0] — 2026-08-29

**Stable production release: Site navigation, consistent styling, and complete API documentation.**

### Added
- **Site-wide navigation consistency**: Unified navigation across all pages
  - Navigation: Home · Projects · Writing · Now · Lab
  - Lab link points to `/lab.html`
  - Proper `.active` state on current page
  - Navigation added to `lab.html` header

- **Lab API page improvements**:
  - Header with navigation and subtitle
  - Centered layout matching content width
  - Footer with copyright
  - Favicon (site branding)
  - Stylesheet integration with main site

- **API Documentation** (`API.md`):
  - Complete endpoint reference (health, catalan, snapshot)
  - Request/response examples with curl commands
  - HTTP status codes and error handling
  - Authentication behavior and security model
  - Nginx routing and systemd deployment
  - Rate limiting recommendations
  - Catalan number u128 limitations
  - Integration guide for monitoring and integration

### Fixed
- Consistent footer format across all pages (copyright notice)
- Lab page layout centering
- CSS cascade for lab-api overrides
- Body width constraints on lab page

### Updated Pages
- `index.html` — Navigation link label "Lab API" → "Lab"
- `projects.html` — Added Lab to navigation
- `writing.html` — Added Lab to navigation; updated footer
- `now.html` — Added Lab to navigation
- `lab.html` — Complete overhaul (header, nav, footer, favicon, styling)
- `writing/calculating-pi/index.html` — Updated footer; added Lab to nav
- `writing/golden-ratio/index.html` — Updated footer; added Lab to nav
- `writing/history-of-cryptography/index.html` — Updated footer; added Lab to nav
- `writing/pythagorean-triples/index.html` — Updated footer; added Lab to nav
- `README.md` — Added Lab API section with link to API.md
- `API.md` — New: Production-quality API reference documentation

### Status
- ✅ Frontend: Consistent navigation, styling, and layout
- ✅ Lab page: Header, nav, footer, favicon, centered layout
- ✅ API: Documented, stable, and production-ready
- ✅ Architecture: Verified Nginx routing, systemd, HTTPS, auth
- 🔒 Frozen: No further feature additions planned

**This release marks the completion of the site redesign and API documentation. The Lab API service is intentionally minimal and stable; future development focus will shift to other projects.**
