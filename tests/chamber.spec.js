// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Chamber of Primes Suite — https://abhrankan.duckdns.org/chamber.html', () => {
  /** @type {string[]} */
  const pageErrors = [];
  /** @type {string[]} */
  const consoleErrors = [];

  test.beforeEach(async ({ page, baseURL }) => {
    pageErrors.length = 0;
    consoleErrors.length = 0;

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Dismiss any modal dialogs
    page.on('dialog', async (dialog) => {
      await dialog.dismiss().catch(() => {});
    });

    // In local testing, mock REST fallback endpoint if local daemon is not running
    if (!baseURL || !baseURL.includes('abhrankan.duckdns.org')) {
      await page.route('**/*math/fermat*', async (route) => {
        let n = 5959;
        try {
          const postData = JSON.parse(route.request().postData() || '{}');
          if (postData.n) n = parseInt(postData.n, 10);
        } catch {}

        if (n === 5959) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              ok: true,
              n: 5959,
              found: true,
              p: 59,
              q: 101,
              x: 80,
              y: 21,
              steps_count: 3,
              elapsed_us: 12,
              reason: 'found',
              initial_x: 78,
              steps: [
                { step: 1, x: 78, r: 125, sieve_passed: false, rejected_by: 3, is_square: false, y: null },
                { step: 2, x: 79, r: 282, sieve_passed: false, rejected_by: 3, is_square: false, y: null },
                { step: 3, x: 80, r: 441, sieve_passed: true, rejected_by: null, is_square: true, y: 21 },
              ],
              steps_truncated: false,
            }),
          });
        }

        const initialX = Math.ceil(Math.sqrt(n));
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            n,
            found: true,
            p: 1,
            q: n,
            x: initialX,
            y: 0,
            steps_count: 1,
            elapsed_us: 5,
            reason: 'found',
            initial_x: initialX,
            steps: [{ step: 1, x: initialX, r: 0, sieve_passed: true, rejected_by: null, is_square: true, y: 0 }],
            steps_truncated: false,
          }),
        });
      });
    }
  });

  test.afterEach(async ({ page }) => {
    expect(pageErrors, `Unhandled page errors: ${pageErrors.join(', ')}`).toEqual([]);
  });

  test('Chamber of Primes page loads correctly with cartouche and stone tablet', async ({ page }) => {
    await page.goto('/chamber.html');

    // Title and banner checks
    await expect(page).toHaveTitle(/The Chamber of Primes/);
    await expect(page.locator('.chamber-cartouche-title h1')).toHaveText('The Chamber of Primes');

    // Default stone tablet readings for Tutankhamun (5,959)
    await expect(page.locator('#tablet-n')).toHaveText('5,959');
    await expect(page.locator('#tablet-x')).toHaveText('78');
    await expect(page.locator('#tablet-r')).toHaveText('125');

    // Egyptian Hieroglyphic numeral display
    const hieroglyph = page.locator('#hieroglyph-n');
    await expect(hieroglyph).toBeVisible();
    await expect(hieroglyph).toContainText('𓆼');

    // Sieve of Ma'at grid rendered with 20 prime cells
    const sieveChips = page.locator('#chamber-sieve-grid .chamber-sieve-cell');
    await expect(sieveChips).toHaveCount(20);

    // Canvas visualizer rendered
    const canvas = page.locator('#chamber-canvas');
    await expect(canvas).toBeVisible();
  });

  test('Pharaoh presets switch modulus and update hieroglyphic readings', async ({ page }) => {
    await page.goto('/chamber.html');

    // Cleopatra (8,051)
    await page.click('button[data-preset="cleopatra"]');
    await expect(page.locator('#tablet-n')).toHaveText('8,051');
    await expect(page.locator('#chamber-input-n')).toHaveValue('8051');
    await expect(page.locator('#tablet-x')).toHaveText('90');

    // Ramses II (10,969,629,527)
    await page.click('button[data-preset="ramses"]');
    await expect(page.locator('#tablet-n')).toHaveText('10,969,629,527');
    await expect(page.locator('#chamber-input-n')).toHaveValue('10969629527');

    // Nefertiti (1,000,000,007)
    await page.click('button[data-preset="nefertiti"]');
    await expect(page.locator('#tablet-n')).toHaveText('1,000,000,007');
    await expect(page.locator('#chamber-input-n')).toHaveValue('1000000007');

    // Return to Tutankhamun (5,959)
    await page.click('button[data-preset="tutankhamun"]');
    await expect(page.locator('#tablet-n')).toHaveText('5,959');
    await expect(page.locator('#chamber-input-n')).toHaveValue('5959');
  });

  test('Factorization execution reveals victory banner with non-trivial factors (59 x 101)', async ({ page }) => {
    await page.goto('/chamber.html');

    // Start factorization
    await page.click('#chamber-btn-play');

    // Victory banner appears upon finding factors
    const banner = page.locator('#chamber-result-banner');
    await expect(banner).toBeVisible({ timeout: 15000 });

    const formula = page.locator('#chamber-result-formula');
    await expect(formula).toContainText('59 × 101');
    await expect(formula).toContainText('5959');

    // Tablet readings update to final factor dimensions
    await expect(page.locator('#tablet-x')).toHaveText('80');
    await expect(page.locator('#tablet-y')).toHaveText('21');
  });

  test('Step button executes single Fermat iterations manually', async ({ page }) => {
    await page.goto('/chamber.html');

    const stepMetric = page.locator('#metric-step');
    await expect(stepMetric).toHaveText('0');

    // Perform single step
    await page.click('#chamber-btn-step');

    // Metric advances from initial 0
    await expect(stepMetric).toHaveText(/^[1-9]\d*$/, { timeout: 10000 });
  });

  test('Speed slider updates animation delay readout', async ({ page }) => {
    await page.goto('/chamber.html');

    const slider = page.locator('#chamber-slider-speed');
    const label = page.locator('#chamber-speed-label');

    await expect(label).toHaveText('60 ms');

    await slider.fill('150');
    await slider.dispatchEvent('input');
    await expect(label).toHaveText('150 ms');
  });

  test('Mobile viewports show zero horizontal overflow on chamber page', async ({ page }) => {
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 13', width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/chamber.html');

      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(isOverflowing, `Horizontal overflow detected on ${vp.name}`).toBe(false);
    }
  });
});
