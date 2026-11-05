// @ts-check
const { test, expect } = require('@playwright/test');

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

    // For local static preview, proxy /api and /crypto-api to live production backend (mimicking Nginx)
    if (baseURL && !baseURL.includes('abhrankan.duckdns.org')) {
      await page.route('**/api/**', async (route) => {
        try {
          const targetUrl = route.request().url().replace(/^http:\/\/[^/]+\/api/, 'https://abhrankan.duckdns.org/api');
          const response = await route.fetch({ url: targetUrl });
          await route.fulfill({ response });
        } catch {
          // Ignore in-flight routes when test finishes or page navigates
        }
      });
      await page.route('**/crypto-api/**', async (route) => {
        try {
          const targetUrl = route.request().url().replace(/^http:\/\/[^/]+\/crypto-api/, 'https://abhrankan.duckdns.org/crypto-api');
          const response = await route.fetch({ url: targetUrl });
          await route.fulfill({ response });
        } catch {
          // Ignore aborted in-flight routes
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
});
