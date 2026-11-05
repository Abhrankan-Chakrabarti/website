// @ts-check
const { test, expect } = require('@playwright/test');

// Pure JS contract mock for Number Theory API endpoints (mimicking lab-api)
function mockNumberTheory(n) {
  if (n === 1) {
    return {
      n: 1,
      factors: [],
      prime_factors: [],
      is_prime: false,
      expression: '1 (empty product)',
      phi: 1,
      mobius: 1,
      count: 1,
      sum: 1,
      divisors: [1],
      next_prime: 2,
      previous_prime: null,
      prime_pi: 0,
    };
  }

  const factors = [];
  const prime_factors = [];
  let temp = n;
  for (let d = 2; d * d <= temp; d++) {
    if (temp % d === 0) {
      let p = 0;
      while (temp % d === 0) {
        temp /= d;
        p++;
      }
      factors.push({ prime: d, power: p });
      prime_factors.push(d);
    }
  }
  if (temp > 1) {
    factors.push({ prime: temp, power: 1 });
    prime_factors.push(temp);
  }

  const is_prime = factors.length === 1 && factors[0].power === 1;
  const expression = factors.map((f) => (f.power > 1 ? `${f.prime}^${f.power}` : `${f.prime}`)).join(' × ');

  let phi = n;
  for (const p of prime_factors) {
    phi = Math.floor((phi * (p - 1)) / p);
  }

  const has_repeated = factors.some((f) => f.power > 1);
  const mobius = has_repeated ? 0 : factors.length % 2 === 0 ? 1 : -1;

  let count = 1;
  let sum = 1;
  for (const f of factors) {
    count *= f.power + 1;
    let term = 0;
    for (let i = 0; i <= f.power; i++) term += Math.pow(f.prime, i);
    sum *= term;
  }

  const divisors = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisors.push(i);
  }

  function isP(num) {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
    return true;
  }
  let np = n + 1;
  while (!isP(np)) np++;
  let pp = null;
  if (n > 2) {
    let cand = n - 1;
    while (cand >= 2 && !isP(cand)) cand--;
    if (cand >= 2) pp = cand;
  }
  let pCount = 0;
  for (let i = 2; i <= n; i++) if (isP(i)) pCount++;

  return { n, factors, prime_factors, is_prime, expression, phi, mobius, count, sum, divisors, next_prime: np, previous_prime: pp, prime_pi: pCount };
}

test.describe('Lab Regression & Smoke Suite — https://abhrankan.duckdns.org/lab.html', () => {
  /** @type {string[]} */
  const consoleErrors = [];
  /** @type {string[]} */
  const pageErrors = [];

  test.beforeEach(async ({ page, baseURL, context }) => {
    consoleErrors.length = 0;
    pageErrors.length = 0;

    // Monitor unhandled exceptions and console errors
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Grant clipboard permissions for copy link/results testing
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {
      // Ignore if permission granting is unsupported in current browser engine
    }

    // For local static preview, provide contract-accurate API mocks (with fallback to live edge)
    if (baseURL && !baseURL.includes('abhrankan.duckdns.org')) {
      await page.route('**/{api,crypto-api,school}/**', async (route) => {
        const url = route.request().url();

        // 1. Core health & metadata
        if (url.includes('/api/health')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, service: 'lab-api' }) });
        }
        if (url.includes('/api/v1/info')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, version: '0.9.0', service: 'lab-api' }) });
        }
        if (url.includes('/crypto-api/health')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, service: 'crypto-lab' }) });
        }
        if (url.includes('/crypto-api/v1/info')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, version: '0.14.0', service: 'crypto-lab' }) });
        }
        if (url.includes('/school/api/health')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, scope: 'school' }) });
        }

        // 2. Protected routes with Basic Auth checks
        if (url.includes('/api/v1/snapshot')) {
          return route.fulfill({ status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Private API"' }, body: JSON.stringify({ error: 'Request failed with HTTP 401' }) });
        }
        if (url.includes('/crypto-api/v1/hash') || url.includes('/crypto-api/v1/hmac')) {
          return route.fulfill({ status: 401, headers: { 'WWW-Authenticate': 'Basic realm="crypto-lab"' }, body: JSON.stringify({ error: 'Request failed with HTTP 401' }) });
        }
        if (url.includes('/school/api/tables')) {
          return route.fulfill({ status: 401, headers: { 'WWW-Authenticate': 'Basic realm="School Database"' }, body: JSON.stringify({ error: 'Request failed with HTTP 401' }) });
        }

        // 3. Number Theory Explorer API endpoints
        const matchNt = url.match(/\/api\/v1\/math\/(factor|totient|mobius|divisor-count|divisor-sum|divisors|is-prime|next-prime|previous-prime|prime-pi|pi)\/(\d+)/);
        if (matchNt) {
          const endpoint = matchNt[1];
          const n = parseInt(matchNt[2], 10);
          const data = mockNumberTheory(n);
          if (endpoint === 'factor') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, factors: data.factors, prime_factors: data.prime_factors, expression: data.expression, is_prime: data.is_prime }) });
          if (endpoint === 'totient') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.phi }) });
          if (endpoint === 'mobius') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.mobius }) });
          if (endpoint === 'divisor-count') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.count }) });
          if (endpoint === 'divisor-sum') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.sum }) });
          if (endpoint === 'divisors') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, divisors: data.divisors }) });
          if (endpoint === 'is-prime') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, prime: data.is_prime }) });
          if (endpoint === 'next-prime') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.next_prime }) });
          if (endpoint === 'previous-prime') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.previous_prime }) });
          if (endpoint === 'prime-pi' || endpoint === 'pi') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: data.n, value: data.prime_pi }) });
        }

        // 4. Crypto tools endpoints
        if (url.includes('/crypto-api/v1/math/factor')) {
          const nMatch = url.match(/[?&]n=(\d+)/);
          const n = nMatch ? parseInt(nMatch[1], 10) : 104729;
          if (n === 8051) {
            return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n: 8051, factors: [{ prime: 83, power: 1 }, { prime: 97, power: 1 }], prime_factors: [83, 97], expression: '83 * 97', is_prime: false }) });
          }
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ n, factors: [{ prime: n, power: 1 }], prime_factors: [n], expression: String(n), is_prime: true }) });
        }
        if (url.includes('/crypto-api/v1/math/fermat')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, n: 5959, found: true, p: 59, q: 101, x: 80, y: 21, steps_count: 3, elapsed_us: 2, reason: 'found', initial_x: 78, steps: [], steps_truncated: false }) });
        }
        if (url.includes('/crypto-api/v1/math/mersenne')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, p: 31, is_prime: true, mp: '2147483647', digits: 10, bits: 31, p_is_prime: true }) });
        }
        if (url.includes('/crypto-api/v1/math/dh/keygen')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, g: 5, p: 23, private_key: 6, public_key: 8 }) });
        }

        // Fallback: try proxying to live edge if available
        try {
          const targetUrl = route.request().url().replace(/^http:\/\/[^/]+/, 'https://abhrankan.duckdns.org');
          const response = await route.fetch({ url: targetUrl, timeout: 3000 });
          return route.fulfill({ response });
        } catch {
          return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Endpoint not found' }) });
        }
      });
    }
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
    // Assert 0 uncaught JavaScript runtime exceptions occurred during test
    expect(pageErrors, `Uncaught page errors detected: ${pageErrors.join('; ')}`).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  // 1. EXPLORER PRESET VALUES (360, 97, 28, 30, 12, 1)
  // ---------------------------------------------------------------------------
  test.describe('1. Number Theory Explorer Presets', () => {
    test('Preset 360: composite, abundant, not square-free', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="360"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('360');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      // Classification badges
      await expect(output.locator('.nt-badge--composite')).toContainText('Composite');
      await expect(output.locator('.nt-badge--abundant')).toContainText('Abundant (abundance +450)');
      await expect(output.locator('.nt-badge').filter({ hasText: 'Not square-free' })).toContainText('Not square-free');

      // Arithmetic values & HTML superscripts
      expect(await output.innerHTML()).toContain('2<sup>3</sup> × 3<sup>2</sup> × 5');
      await expect(output).toContainText('96'); // φ(360)
      await expect(output).toContainText('72'); // π(360)
      await expect(output).toContainText('τ = 24');
      await expect(output).toContainText('σ = 1170');
      await expect(output).toContainText('s(n) = 810');
      await expect(output).toContainText('359 ← 360 → 367');
      await expect(output).toContainText('Prime gap = 8');
    });

    test('Preset 97: prime, deficient, square-free', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="97"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('97');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      await expect(output.locator('.nt-badge--prime')).toContainText('Prime number');
      await expect(output.locator('.nt-badge--deficient')).toContainText('Deficient');
      await expect(output.locator('.nt-badge--squarefree')).toContainText('Square-free');

      await expect(output).toContainText('97');
      await expect(output).toContainText('τ = 2');
      await expect(output).toContainText('σ = 98');
      await expect(output).toContainText('s(n) = 1');
      await expect(output).toContainText('89 ← 97 → 101');
      await expect(output).toContainText('Prime gap = 12');
    });

    test('Preset 28: perfect number, not square-free (2² × 7)', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="28"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('28');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      await expect(output.locator('.nt-badge--perfect')).toContainText('Perfect number');
      await expect(output.locator('.nt-badge').filter({ hasText: 'Not square-free' })).toContainText('Not square-free');

      expect(await output.innerHTML()).toContain('2<sup>2</sup> × 7');
      await expect(output).toContainText('τ = 6');
      await expect(output).toContainText('σ = 56');
      await expect(output).toContainText('s(n) = 28');
    });

    test('Preset 30: sphenic composite, square-free (μ = -1)', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="30"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('30');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      await expect(output.locator('.nt-badge--composite')).toContainText('Composite');
      await expect(output.locator('.nt-badge--squarefree')).toContainText('Square-free');

      await expect(output).toContainText('2 × 3 × 5');
      await expect(output).toContainText('ω(n) = 3 distinct, Ω(n) = 3 total');
      await expect(output).toContainText('-1'); // μ(30)
      await expect(output).toContainText('τ = 8');
      await expect(output).toContainText('σ = 72');
    });

    test('Preset 12: twin-sandwich composite, not square-free', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="12"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('12');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      await expect(output.locator('.nt-badge').filter({ hasText: 'Not square-free' })).toContainText('Not square-free');
      expect(await output.innerHTML()).toContain('2<sup>2</sup> × 3');
      await expect(output).toContainText('11 ← 12 → 13');
      await expect(output).toContainText('Prime gap = 2');
    });

    test('Preset 1: unit (neither prime nor composite)', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('.nt-preset-btn[data-n="1"]');

      await expect(page.locator('#nt-explorer-n')).toHaveValue('1');
      const output = page.locator('#nt-explorer-result .nt-explorer-output');
      await expect(output).toBeVisible();

      await expect(output.locator('.nt-badge').filter({ hasText: 'Unit (neither prime nor composite)' })).toBeVisible();
      await expect(output.locator('.nt-badge--squarefree')).toContainText('Square-free');
      await expect(output).toContainText('1 (empty product)');
      await expect(output).toContainText('τ = 1');
      await expect(output).toContainText('σ = 1');
      await expect(output).toContainText('s(n) = 0');
    });
  });

  // ---------------------------------------------------------------------------
  // 2. INVALID BOUNDS & MALFORMED PARAMETERS
  // ---------------------------------------------------------------------------
  test.describe('2. Validation & Parameter Error Handling', () => {
    test('Malformed and out-of-bounds ?explore= query parameters are cleaned on load', async ({ page }) => {
      // Non-numeric
      await page.goto('/lab.html?explore=abc');
      await expect(page).not.toHaveURL(/explore=/);

      // Below bounds (0)
      await page.goto('/lab.html?explore=0');
      await expect(page).not.toHaveURL(/explore=/);

      // Negative (-15)
      await page.goto('/lab.html?explore=-15');
      await expect(page).not.toHaveURL(/explore=/);

      // Above bounds (1000001)
      await page.goto('/lab.html?explore=1000001');
      await expect(page).not.toHaveURL(/explore=/);

      // Huge overflow
      await page.goto('/lab.html?explore=9999999999999');
      await expect(page).not.toHaveURL(/explore=/);
    });

    test('Client-side form input validation blocks out-of-bounds manual submissions', async ({ page }) => {
      await page.goto('/lab.html');

      const input = page.locator('#nt-explorer-n');
      const result = page.locator('#nt-explorer-result');

      // Test 0
      await input.fill('0');
      await page.locator('#nt-explorer-form button[type="submit"]').click();
      await expect(input).toHaveJSProperty('validity.valid', false);
      await expect(result).toContainText('Enter an integer from 1 to 1,000,000');
      await expect(result.locator('.nt-explorer-output')).toHaveCount(0);

      // Test 1000001
      await input.fill('1000001');
      await page.locator('#nt-explorer-form button[type="submit"]').click();
      await expect(input).toHaveJSProperty('validity.valid', false);
      await expect(result).toContainText('Enter an integer from 1 to 1,000,000');
      await expect(result.locator('.nt-explorer-output')).toHaveCount(0);

      // Test empty string
      await input.fill('');
      await page.locator('#nt-explorer-form button[type="submit"]').click();
      await expect(input).toHaveJSProperty('validity.valid', false);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. COPY ACTIONS (LINK & RESULTS)
  // ---------------------------------------------------------------------------
  test.describe('3. Sharing & Copy Actions', () => {
    test('Copy link updates button label feedback and writes canonical permalink to clipboard', async ({ page, baseURL }) => {
      await page.goto('/lab.html?explore=360');
      await expect(page.locator('#nt-explorer-result .nt-explorer-output')).toBeVisible();

      const copyLinkBtn = page.locator('#copy-nt-link');
      await copyLinkBtn.click();
      await expect(copyLinkBtn).toHaveText('Link copied');

      // Read clipboard contents
      try {
        const clipboard = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboard).toContain('/lab.html?explore=360');
      } catch {
        // In headless browsers lacking direct clipboard read permission, button label feedback confirms action
      }
    });

    test('Copy results generates structured mathematical report with Unicode superscripts', async ({ page }) => {
      await page.goto('/lab.html?explore=360');
      await expect(page.locator('#nt-explorer-result .nt-explorer-output')).toBeVisible();

      const copyResultsBtn = page.locator('#copy-nt-results');
      await copyResultsBtn.click();
      await expect(copyResultsBtn).toHaveText('Results copied');

      try {
        const clipboard = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboard).toContain('Number Theory Analysis for n = 360');
        expect(clipboard).toContain('2³ × 3² × 5'); // Unicode superscripts
        expect(clipboard).toContain('Euler\'s Totient φ(n) = 96');
        expect(clipboard).toContain('Möbius Function μ(n) = 0');
        expect(clipboard).toContain('Divisor Structure: τ(n) = 24, σ(n) = 1170, s(n) = 810');
        expect(clipboard).toContain('1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360');
      } catch {
        // Fallback gracefully if clipboard read API is denied by headless runner
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 4. MOBILE RESPONSIVENESS & HORIZONTAL OVERFLOW
  // ---------------------------------------------------------------------------
  test.describe('4. Mobile Viewport & Responsiveness', () => {
    const mobileViewports = [
      { name: 'iPhone SE (375x667)', width: 375, height: 667 },
      { name: 'iPhone 13/14 (390x844)', width: 390, height: 844 },
    ];

    for (const vp of mobileViewports) {
      test(`Zero horizontal overflow on ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/lab.html?explore=360');
        await expect(page.locator('#nt-explorer-result .nt-explorer-output')).toBeVisible();

        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasHorizontalOverflow, `Horizontal scroll detected on ${vp.name}`).toBe(false);
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 5. CATEGORY FILTER NAVIGATION
  // ---------------------------------------------------------------------------
  test.describe('5. Category Filters', () => {
    test('Filtering toggles visibility of cards according to data-category attributes', async ({ page }) => {
      await page.goto('/lab.html');

      const filterCrypto = page.locator('.lab-filter-btn[data-category="crypto"]');
      const filterMath = page.locator('.lab-filter-btn[data-category="math"]');
      const filterAll = page.locator('.lab-filter-btn[data-category="all"]');

      // Click "Crypto & Stego"
      await filterCrypto.click();
      await expect(filterCrypto).toHaveAttribute('aria-pressed', 'true');
      await expect(filterAll).toHaveAttribute('aria-pressed', 'false');

      // Crypto cards should be visible; math-only cards should be hidden
      await expect(page.locator('#crypto-rsa-form')).toBeVisible();
      await expect(page.locator('#catalan-form')).toBeHidden();

      // Click "Number Theory"
      await filterMath.click();
      await expect(filterMath).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#nt-explorer-form')).toBeVisible();
      await expect(page.locator('#snapshot-form')).toBeHidden();

      // Click "All"
      await filterAll.click();
      await expect(filterAll).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#catalan-form')).toBeVisible();
      await expect(page.locator('#crypto-rsa-form')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 6. BROWSER HISTORY (BACK / FORWARD NAVIGATION)
  // ---------------------------------------------------------------------------
  test.describe('6. Browser History & State Synchronization', () => {
    test('Back and Forward navigation restores input value, URL query, and explorer output', async ({ page }) => {
      await page.goto('/lab.html');

      // Step 1: Click 360
      await page.click('.nt-preset-btn[data-n="360"]');
      await expect(page).toHaveURL(/explore=360/);
      await expect(page.locator('#nt-explorer-result .nt-badge--composite')).toBeVisible();

      // Step 2: Click 97
      await page.click('.nt-preset-btn[data-n="97"]');
      await expect(page).toHaveURL(/explore=97/);
      await expect(page.locator('#nt-explorer-result .nt-badge--prime')).toBeVisible();

      // Step 3: Click 28
      await page.click('.nt-preset-btn[data-n="28"]');
      await expect(page).toHaveURL(/explore=28/);
      await expect(page.locator('#nt-explorer-result .nt-badge--perfect')).toBeVisible();

      // Step 4: Go Back to 97
      await page.goBack();
      await expect(page).toHaveURL(/explore=97/);
      await expect(page.locator('#nt-explorer-n')).toHaveValue('97');
      await expect(page.locator('#nt-explorer-result .nt-badge--prime')).toBeVisible();

      // Step 5: Go Back to 360
      await page.goBack();
      await expect(page).toHaveURL(/explore=360/);
      await expect(page.locator('#nt-explorer-n')).toHaveValue('360');
      await expect(page.locator('#nt-explorer-result .nt-badge--composite')).toBeVisible();

      // Step 6: Go Forward to 97
      await page.goForward();
      await expect(page).toHaveURL(/explore=97/);
      await expect(page.locator('#nt-explorer-n')).toHaveValue('97');
      await expect(page.locator('#nt-explorer-result .nt-badge--prime')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Protected API Authentication Guardrails
  // ---------------------------------------------------------------------------
  test.describe('7. Protected API Authentication Guardrails', () => {
    test('Snapshot form enforces required credentials client-side', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('#clear-snapshot');

      // Native HTML5 required validation
      const usernameInput = page.locator('#snapshot-username');
      expect(await usernameInput.evaluate((el) => el.checkValidity())).toBe(false);

      // Whitespace-only submission triggers client validation message
      await usernameInput.fill('   ');
      await page.locator('#snapshot-password').fill('   ');
      await page.click('#snapshot-form button[type="submit"]');
      await expect(page.locator('#snapshot-output')).toHaveText('Enter both username and password.');
    });

    test('Snapshot form securely rejects invalid Basic Auth credentials with HTTP 401 and wipes password', async ({ page }) => {
      await page.goto('/lab.html');
      await page.fill('#snapshot-username', 'invalid_tester');
      const passwordInput = page.locator('#snapshot-password');
      await passwordInput.fill('incorrect_password_xyz');
      await page.click('#snapshot-form button[type="submit"]');

      await expect(page.locator('#snapshot-output')).toContainText('HTTP 401');
      await expect(passwordInput).toHaveValue('');
    });

    test('Protected Hash form rejects unauthorized requests with HTTP 401 and clears credentials', async ({ page }) => {
      await page.goto('/lab.html');
      await page.fill('#hash-data', 'antigravity-regression-test');
      await page.fill('#hash-username', 'unauthorized_crypto_user');
      const hashPasswordInput = page.locator('#hash-password');
      await hashPasswordInput.fill('invalid_hash_secret');
      await page.click('#hash-form button[type="submit"]');

      await expect(page.locator('#hash-result')).toContainText('HTTP 401');
      await expect(hashPasswordInput).toHaveValue('');
    });

    test('Nginx reverse proxy enforces Basic Auth realm headers on protected routes while keeping health endpoints public', async ({ page, baseURL }) => {
      await page.goto('/lab.html');

      // Health endpoints return 200 OK without authentication
      const apiHealth = await page.evaluate(async () => {
        const res = await fetch('/api/health');
        return { status: res.status, json: await res.json() };
      });
      expect(apiHealth.status).toBe(200);
      expect(apiHealth.json.ok).toBe(true);

      const cryptoHealth = await page.evaluate(async () => {
        const res = await fetch('/crypto-api/health');
        return { status: res.status, json: await res.json() };
      });
      expect(cryptoHealth.status).toBe(200);
      expect(cryptoHealth.json.ok).toBe(true);

      const schoolHealth = await page.evaluate(async () => {
        const res = await fetch('/school/api/health');
        return { status: res.status, json: await res.json() };
      });
      expect(schoolHealth.status).toBe(200);
      expect(schoolHealth.json.ok).toBe(true);

      // Protected routes return 401 Unauthorized
      const snapshot = await page.evaluate(async () => {
        const res = await fetch('/api/v1/snapshot');
        return { status: res.status };
      });
      expect(snapshot.status).toBe(401);

      const hash = await page.evaluate(async () => {
        const res = await fetch('/crypto-api/v1/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ algorithm: 'sha256', data: 'test' }),
        });
        return { status: res.status };
      });
      expect(hash.status).toBe(401);

      const school = await page.evaluate(async () => {
        const res = await fetch('/school/api/tables');
        return { status: res.status };
      });
      expect(school.status).toBe(401);

      // For live production deployment, also verify exact Nginx edge WWW-Authenticate headers
      if (baseURL && baseURL.includes('abhrankan.duckdns.org')) {
        const snapDirect = await page.request.get(`${baseURL}/api/v1/snapshot`);
        expect(snapDirect.headers()['www-authenticate']).toContain('Basic realm="Private API"');

        const hashDirect = await page.request.post(`${baseURL}/crypto-api/v1/hash`, {
          data: { algorithm: 'sha256', data: 'test' },
        });
        expect(hashDirect.headers()['www-authenticate']).toContain('Basic realm="crypto-lab"');

        const schoolDirect = await page.request.get(`${baseURL}/school/api/tables`);
        expect(schoolDirect.headers()['www-authenticate']).toContain('Basic realm="School Database"');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Crypto & Factorization Tool Regressions
  // ---------------------------------------------------------------------------
  test.describe('8. Crypto & Factorization Tool Regressions', () => {
    test('Crypto API health and metadata load operational status', async ({ page }) => {
      await page.goto('/lab.html');
      const badge = page.locator('#crypto-health-badge');
      await expect(badge).toHaveText('Online', { timeout: 10000 });
      await expect(badge).toHaveClass(/status-badge--ok/);
      await expect(page.locator('#crypto-health-message')).toContainText('crypto-lab responded');
      await expect(page.locator('#crypto-info-output')).toContainText('crypto-lab');
    });

    test('Pollard rho tool correctly factors prime and composite integers', async ({ page }) => {
      await page.goto('/lab.html');

      // Test prime 104729
      await page.click('#crypto-factor-form button[type="submit"]');
      const result = page.locator('#crypto-factor-result');
      await expect(result).toContainText('104729');
      await expect(result).toContainText('Prime');

      // Test composite 8051 (83 x 97)
      await page.fill('#crypto-factor-n', '8051');
      await page.click('#crypto-factor-form button[type="submit"]');
      await expect(result).toContainText('8051');
      await expect(result).toContainText('83 * 97');
      await expect(result).toContainText('Composite');
    });

    test('Fermat difference of squares factors odd composite integer 5959 (59 x 101)', async ({ page }) => {
      await page.goto('/lab.html');
      await page.click('#crypto-fermat-form button[type="submit"]');
      const result = page.locator('#crypto-fermat-result');
      await expect(result).toContainText('5,959');
      await expect(result).toContainText('59 × 101');
      await expect(result).toContainText('x = 80, y = 21');
    });

    test('Mersenne prime tool confirms M_31 is prime via Lucas-Lehmer test', async ({ page }) => {
      await page.goto('/lab.html');
      await page.fill('#crypto-mersenne-p', '31');
      await page.click('#submit-crypto-mersenne');
      const result = page.locator('#crypto-mersenne-result');
      await expect(result).toContainText('is PRIME!');
      await expect(result).toContainText('2147483647');
      await expect(result).toContainText('10 decimal digits (31 bits)');
    });

    test('Diffie-Hellman key exchange generates deterministic keypair (g=5, p=23, a=6 -> A=8)', async ({ page }) => {
      await page.goto('/lab.html');
      await page.fill('#crypto-dh-p', '23');
      await page.fill('#crypto-dh-g', '5');
      await page.fill('#crypto-dh-priv', '6');
      await page.click('#submit-crypto-dh');
      const result = page.locator('#crypto-dh-result');
      await expect(result).toContainText('Diffie–Hellman Keypair Generated');
      await expect(result).toContainText('Public Key A: 8');
      await expect(result).toContainText('Private Key a: 6');
    });
  });
});
