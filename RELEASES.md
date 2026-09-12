# Releases

## [v0.5.1] — 2026-09-12

**School Database importer with validation and rollback-safe activation.**

### Added

- Added a one-shot School Database importer:
  - `lab-api import <candidate.db>`
- Added SQLite integrity validation before activation.
- Added schema validation for imported School Database files.
- Added safe activation of validated database files.
- Added Unix atomic-rename activation.
- Added rollback-safe activation behavior for Windows.
- Failed imports leave the currently active database unchanged.
- Added importer tests covering validation and activation behavior.

### Security and Reliability

- Imported databases are validated before becoming active.
- SQLite integrity checks prevent corrupted databases from being activated.
- Schema validation ensures compatibility with the School Database API.
- Database replacement is performed only after successful validation.
- The running API continues using the existing database if import validation fails.
- The importer does not start the HTTP server.

### Configuration

- The importer uses the configured `SCHOOL_DB_PATH`.
- Production School Database location:

  ```text
  /var/lib/lab-api/School.db
  ```

- The API continues to bind to:

  ```text
  127.0.0.1:8088
  ```

- Public access remains behind the existing Nginx HTTPS and Basic Authentication boundary.

### Compatibility

- Existing core API endpoints remain unchanged.
- Existing School Database API routes remain available.
- Existing deployment architecture remains unchanged.
- No additional database server, queue, container stack, or external service is required.

### Validation

- All 39 tests passed.
- `cargo clippy -- -D warnings` completed successfully.
- The importer was tested against a real School Database file.
- Production deployment and database activation were verified.

### Status

- ✅ Validated School Database importer
- ✅ SQLite integrity and schema validation
- ✅ Safe database activation
- ✅ Rollback-safe replacement behavior
- ✅ One-shot import CLI
- ✅ Existing API compatibility maintained
- 🔒 Runtime remains read-only

---

## [v0.5.0] — 2026-09-08

**Improved School Database browsing with pagination, search, and student details.**

### Added

- Added real pagination totals through the `total` field.
- Added debounced School Database search.
- Added clickable student rows in the School frontend.
- Added a student-detail route.
- Added safe student-detail responses.
- Added deterministic ordering for School Database results.
- Added tests for pagination, search, ordering, and student-detail behavior.

### Security

- Student details are returned through controlled, read-only API responses.
- Search remains bounded and uses literal substring matching.
- Database access continues to use safe column handling and parameterized SQL.
- Existing Nginx HTTPS and Basic Authentication protections remain unchanged.

### Compatibility

- Existing API endpoints remain unchanged.
- Existing table discovery and schema routes remain available.
- Existing deployment architecture remains unchanged.
- No additional runtime service or database infrastructure is required.

### Validation

- Pagination totals were verified.
- Deterministic ordering was verified.
- Pagination results were checked for consistency and non-overlap.
- School Database API and frontend behavior were tested.

### Status

- ✅ Improved School Database pagination
- ✅ Debounced search
- ✅ Clickable student rows
- ✅ Student-detail route
- ✅ Safe student-detail responses
- ✅ Deterministic result ordering
- 🔒 School Database runtime remains read-only

---

## [v0.4.0] — 2026-09-08

**Initial read-only School Database API backed by SQLite.**

### Added

- Added a read-only School Database API backed by SQLite.
- Added dynamic table discovery:

  ```http
  GET /school/api/tables
  ```

- Added dynamic schema discovery:

  ```http
  GET /school/api/tables/{table}/schema
  ```

- Added paginated table access:

  ```http
  GET /school/api/tables/{table}
  ```

- Added bounded literal substring search.
- Added School Database health endpoint:

  ```http
  GET /school/api/health
  ```

- Added the School Database web portal:

  ```text
  /school/
  ```

- Added comprehensive database-layer tests covering:
  - Table and column validation
  - Pagination
  - Search
  - Schema discovery
  - Table discovery
  - Deterministic ordering
  - Sensitive-column filtering

### Security

- School Database access is strictly read-only.
- SQLite is opened using read-only flags.
- Only approved columns are exposed.
- Table and column identifiers are validated and safely quoted.
- SQL queries use parameterized values.
- `LIKE` patterns are escaped safely.
- Pagination and search inputs are bounded.
- Public access remains protected by Nginx HTTPS and Basic Authentication.
- The database is stored outside the repository and is not directly exposed.

### Configuration

- Database path is configured through:

  ```text
  SCHOOL_DB_PATH
  ```

- Production database path:

  ```text
  /var/lib/lab-api/School.db
  ```

- The API binds to:

  ```text
  127.0.0.1:8088
  ```

- Nginx remains the public HTTPS and authentication boundary.

### Compatibility

- Existing API endpoints remain unchanged.
- The Catalan compatibility alias remains available.
- Existing deployment architecture remains unchanged.
- No additional runtime, database server, container, or external service is required.

### Validation

- `cargo fmt` completed successfully.
- Debug test suite passed: 22/22.
- Release test suite passed: 22/22.
- Debug and release builds completed successfully.

### Status

- ✅ Read-only School Database API
- ✅ Dynamic table and schema discovery
- ✅ Pagination and bounded search
- ✅ School Database web portal
- ✅ Database-layer test coverage
- ✅ Nginx HTTPS and Basic Authentication integration
- 🔒 School Database scope frozen
- 🔒 Runtime remains read-only

---

## [v0.3.0] — 2026-09-08

**Math endpoints and protected API snapshot functionality.**

### Added

- Added Catalan number endpoint.
- Added Fibonacci number endpoint.
- Added greatest-common-divisor endpoint.
- Added tests for the new mathematical endpoints.
- Added a Catalan compatibility alias.
- Added public API information at:

  ```http
  GET /v1/info
  ```

- Added protected API snapshot endpoint:

  ```http
  GET /v1/snapshot
  ```

### Compatibility

- Existing API routes remain available.
- Existing deployment and authentication architecture remains unchanged.
- The service remains lightweight and self-hosted.

### Status

- ✅ Catalan numbers
- ✅ Fibonacci numbers
- ✅ Greatest common divisor
- ✅ Public API information
- ✅ Protected API snapshot
- 🔒 Read-only API scope maintained

---

## [v0.2.0] — 2026-08-30

### Added

- Added public service metadata endpoint:

  ```http
  GET /api/v1/info
  ```

- Added an API information panel to the Lab frontend.

### Backend

- Reports service name, API version, package version, route list, build profile, and environment label.
- Keeps the existing authentication model unchanged.
- Only `/api/v1/snapshot` remains protected.
- No new infrastructure or separate service was added.

---

## [v1.0.0] — 2026-08-29

**Stable production release: site navigation, consistent styling, and complete API documentation.**

### Added

#### Site-wide Navigation Consistency

- Unified navigation across all pages:
  - Home
  - Projects
  - Writing
  - Now
  - Lab
- Lab navigation link points to `/lab.html`.
- Added the proper `.active` state on the current page.
- Added navigation to the `lab.html` header.

#### Lab API Page Improvements

- Added a header with navigation and subtitle.
- Added a centered layout matching the main content width.
- Added a footer with copyright information.
- Added a favicon for site branding.
- Integrated the main site stylesheet.

#### API Documentation

Added complete `API.md` documentation covering:

- Health, Catalan, and snapshot endpoints
- Request and response examples
- `curl` commands
- HTTP status codes
- Error handling
- Authentication behavior
- Security model
- Nginx routing
- systemd deployment
- Rate-limiting recommendations
- Catalan number `u128` limitations
- Monitoring and integration guidance

### Fixed

- Standardized the footer format across all pages.
- Fixed Lab page layout centering.
- Fixed the CSS cascade for Lab API overrides.
- Fixed body-width constraints on the Lab page.

### Updated Pages

- `index.html` — Renamed navigation label from “Lab API” to “Lab”.
- `projects.html` — Added Lab to navigation.
- `writing.html` — Added Lab to navigation and updated the footer.
- `now.html` — Added Lab to navigation.
- `lab.html` — Complete overhaul with header, navigation, footer, favicon, and styling.
- `writing/calculating-pi/index.html` — Updated footer and added Lab navigation.
- `writing/golden-ratio/index.html` — Updated footer and added Lab navigation.
- `writing/history-of-cryptography/index.html` — Updated footer and added Lab navigation.
- `writing/pythagorean-triples/index.html` — Updated footer and added Lab navigation.
- `README.md` — Added the Lab API section with a link to `API.md`.
- `API.md` — Added production-quality API reference documentation.

### Status

- ✅ Frontend navigation is consistent.
- ✅ Site styling and layouts are consistent.
- ✅ Lab page includes header, navigation, footer, favicon, and centered layout.
- ✅ API is documented and production-ready.
- ✅ Nginx routing, systemd, HTTPS, and authentication were verified.
- 🔒 No further v1.0.0 feature additions planned.

**This release marked the completion of the site redesign and API documentation.**

---

## [v0.1.0] — 2026-08-29

**Initial release of `crypto-lab`, a small self-hosted Rust cryptography API.**

### Added

- SHA-256 hashing endpoint.
- SHA-512 hashing endpoint.
- HMAC-SHA256 generation.
- HMAC-SHA512 generation.
- Constant-time HMAC verification.
- Public health endpoint.
- Public service information endpoint.
- JSON-based HTTP API built with Axum and Tokio.
- Input and request-body size limits.
- Production-oriented systemd service configuration.
- Nginx reverse-proxy deployment under `/crypto-api/`.

### API

- `GET /health`
- `GET /v1/info`
- `POST /v1/hash`
- `POST /v1/hmac`
- `POST /v1/hmac/verify`

### Security

- HMAC verification uses constant-time comparison.
- Cryptographic operations are protected by Nginx Basic Authentication.
- The service binds only to `127.0.0.1:8089`.
- Request bodies are limited to 64 KiB.
- Individual textual inputs are limited to 32 KiB.
- No private-key storage, wallet functionality, payment processing, or credential-management features are included.

### Infrastructure

- Runs as a dedicated systemd service.
- Exposed through the existing Nginx HTTPS endpoint.
- Reuses the existing authentication configuration.
- Requires no database, queue, container stack, or additional monitoring infrastructure.

### Status

- ✅ SHA-256 and SHA-512 hashing
- ✅ HMAC generation and verification
- ✅ Constant-time verification
- ✅ Public service metadata
- ✅ Request-size limits
- ✅ systemd deployment
- ✅ Nginx HTTPS integration
- 🔒 v0.1.0 scope frozen

**`crypto-lab` is intentionally minimal and focused on cryptographic hashing and HMAC experimentation.**
