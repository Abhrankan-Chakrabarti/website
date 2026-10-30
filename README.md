# Abhrankan Chakrabarti's website

Personal website and portfolio for Abhrankan Chakrabarti:

- [Home](index.html) — introduction and featured work
- [Projects](projects.html) — current projects and external repositories
- [Writing](writing.html) — notes on mathematics, algorithms, cryptography, and related topics
- [Now](now.html) — current focus and activity
- [Lab](lab.html) — live service checks and interactive API tools
- [Chamber](chamber.html) — The Chamber of Primes: Fermat's difference of squares visualizer & Sieve of Ma'at
- [The Chamber of Primes Report](CHAMBER_OF_PRIMES.md) — architecture, Fermat engine, Legendre sieve, and visualizer implementation report
- [API documentation](API.md) — production-facing contracts for `lab-api` and `crypto-lab`
- [Releases](RELEASES.md) — project and website release history

The production site is served as a static website by Nginx at:

<https://abhrankan.duckdns.org>

## Repository structure

```text
website/
├── index.html                 # Home page
├── projects.html              # Project portfolio
├── writing.html               # Writing index
├── now.html                  # Current work and focus
├── lab.html                  # Interactive lab and service checks
├── chamber.html               # The Chamber of Primes visualizer
├── CHAMBER_OF_PRIMES.md      # Source Markdown for CHAMBER_OF_PRIMES.html
├── CHAMBER_OF_PRIMES.html    # Architecture and implementation report for The Chamber of Primes
├── API.md                    # Source Markdown for API.html
├── API.html                  # Generated API documentation page
├── RELEASES.md               # Source Markdown for RELEASES.html
├── RELEASES.html             # Generated release history page
├── style.css                 # Shared site styles
├── assets/
│   ├── chamber.css           # Chamber visualizer styles
│   ├── chamber.js            # Chamber WebSocket client & canvas visualizer
│   ├── lab-api.css           # Lab-specific styles
│   ├── lab-api.js            # Lab API client and interactions
│   └── css/style.css         # Additional shared stylesheet
└── writing/
    ├── calculating-pi/
    ├── chamber-of-primes/
    ├── golden-ratio/
    ├── history-of-cryptography/
    ├── mersenne-primes/
    └── pythagorean-triples/
```

`API.html` and `RELEASES.html` are generated from their Markdown sources. Update
the corresponding `.md` files rather than editing the generated HTML directly.

## Lab integrations

The Lab page is a frontend for two local services published through Nginx.

### `lab-api`

`lab-api` is a Rust/Axum service bound to `127.0.0.1:8088`. The website uses
its public routes for:

- service health
- application metadata
- Catalan numbers
- Fibonacci numbers
- greatest common divisors
- primality testing
- next-prime, previous-prime, and prime-gap calculations
- the prime-counting function π(n)
- bounded prime factorisation
- Euler's totient function φ(n)
- Möbius function μ(n)
- Divisor-count function τ(n)
- Divisor-sum function σ(n)
- Sorted positive divisors

The factorisation, totient, Möbius, divisor-count, divisor-sum, and divisors
tools support `0 ≤ n ≤ 1,000,000`
and use bounded trial division for demonstrations rather than general-purpose
factoring. The Lab page includes interactive forms for the arithmetic
endpoints, with request latency, status, and cURL telemetry.

The School portal is served by the same backend below `/school/`. The website
documents the complete route and authentication contract in [API.md](API.md).

Repository: <https://github.com/Abhrankan-Chakrabarti/lab-api>

### `crypto-lab`

`crypto-lab` is a separate Rust/Axum service bound to `127.0.0.1:8089`. The
Lab page uses its public health, information, and FoxMath number theory exploration routes,
and provides interactive tools for:

- Number-theoretic & elliptic curve exploration (Tonelli-Shanks, Legendre, CRT, continued fractions, ECC point ops)
- Textbook cryptosystems suite (RSA keygen, encrypt, decrypt with CRT, crack; Diffie–Hellman keygen, derive, crack)
- Two-stage Pollard's p - 1 integer factorization (B1, B2) with automatic prime backtracking and prime gap difference tables
- Fermat's difference of squares factorization engine & WebSocket streaming endpoint (`/v1/math/chamber/ws`)
- Mersenne primes, deterministic Lucas–Lehmer primality testing, and prime sequence enumeration (M<sub>p</sub> = 2<sup>p</sup> − 1) with recurrence step tracing
- Euclid–Euler even perfect numbers (2<sup>p−1</sup>(2<sup>p</sup> − 1)) and aliquot sum verification (σ(n) = 2n)
- Seeded, reproducible challenge generation across 13 mathematical & cryptographic topics
- SHA-256 and SHA-512 hashing (authenticated)
- HMAC generation (authenticated)
- HMAC verification (authenticated)

Credentials are requested only per protected operation (hash/HMAC), sent only with that request,
and cleared from the form afterward. The page does not persist credentials. Math routes are public.

Repository: <https://github.com/foxhackerzdevs/crypto-lab>

### The Chamber of Primes (`chamber.html`)

An Ancient Egyptian-themed real-time interactive visualizer for Fermat's Difference of Squares factorization:

$$
n = x^2 - y^2 = (x - y)(x + y)
$$

- **Geometric HTML5 Canvas:** Dynamically visualizes the outer $x \times x$ stone square and the carved $y \times y$ void, demonstrating the gnomon's reassembly into $(x - y) \times (x + y)$.
- **Egyptian Hieroglyphic Numerals:** Real-time base-10 additive numeral converter generating authentic Unicode hieroglyphs (`𓁨 𓆐 𓂭 𓆼 𓍢 𓎆 𓏺`).
- **The Sieve of Ma'at:** 20 small prime runes ($p \in [3, 73]$) providing live visual feedback for Legendre quadratic residue rejection where $(r/p) = -1$, eliminating $>99.999\%$ of non-squares.
- **Dual-Mode Streaming:** Bidirectional WebSocket stream (`/crypto-api/v1/math/chamber/ws`) with automated REST simulation fallback.
- **Pharaoh Presets:** Tutankhamun ($n = 5959$), Cleopatra ($n = 8051$), Ramses II ($n = 10969629527$ factoring a 34-bit RSA modulus in step 1), and Nefertiti ($n = 1000000007$).

## Nginx routing

The static website is served from the Nginx document root. Nginx proxies the
backend services while preserving the public URL shape:

```text
/api/*         → http://127.0.0.1:8088/*
/school/*      → http://127.0.0.1:8088/school/*
/crypto-api/*  → http://127.0.0.1:8089/*
```

The School portal UI and `/school/api/health` are public. The remaining School
API routes use Nginx Basic Authentication, and admin routes additionally rely
on the authenticated-user allowlist enforced by `lab-api`.

The core lab API health, metadata, mathematical routes, and Catalan alias are
public. The system snapshot is protected by Basic Authentication.

The crypto-lab health, information, and `/crypto-api/v1/math/*` routes are public. Hash and HMAC
operations are protected by Basic Authentication.

See [API.md](API.md) for the complete public contract and example Nginx
configuration.

## Local preview

The site is static and can be previewed with any local HTTP server. For
example, from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000/>.

When opening `lab.html` directly as a `file:` URL, the frontend falls back to
the production API host. When served over HTTP, it uses the relative `/api/`
and `/crypto-api/` paths expected from the Nginx deployment.

## Updating and deploying

1. Edit the source HTML, CSS, JavaScript, or Markdown files.
2. Regenerate `API.html` or `RELEASES.html` when their Markdown sources change.
3. Preview the static site locally.
4. Copy the updated static files to `/var/www/abhrankan`.
5. Validate and reload Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

The website repository contains no application server, database, build output,
or runtime dependency. Backend deployment and service management are handled
by the separate `lab-api` and `crypto-lab` repositories.

## License

See [LICENSE](LICENSE).
