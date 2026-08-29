# Releases

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
