// The Chamber of Primes — Fermat's Difference of Squares & Sieve of Ma'at
// Visualizer and WebSocket client with automated REST fallback

(function () {
  'use strict';

  // --- Egyptian Hieroglyphic Numerals (Unicode Block U+13000) ---
  const HIEROGLYPH_DIGITS = [
    { val: 1000000n, glyph: '𓁨', name: 'Heh (Million)' },
    { val: 100000n,  glyph: '𓆐', name: 'Tadpole (100k)' },
    { val: 10000n,   glyph: '𓂭', name: 'Finger (10k)' },
    { val: 1000n,    glyph: '𓆼', name: 'Lotus (1k)' },
    { val: 100n,     glyph: '𓍢', name: 'Rope coil (100)' },
    { val: 10n,      glyph: '𓎆', name: 'Hobble (10)' },
    { val: 1n,       glyph: '𓏺', name: 'Stroke (1)' },
  ];

  function toHieroglyphs(val) {
    if (val === null || val === undefined || val === '') return '—';
    let rem;
    try {
      rem = BigInt(val);
    } catch {
      return String(val);
    }
    if (rem === 0n) return '𓄤'; // Nefer (zero/beauty)
    if (rem < 0n) rem = -rem;

    const parts = [];
    for (const h of HIEROGLYPH_DIGITS) {
      if (rem >= h.val) {
        const count = rem / h.val;
        rem = rem % h.val;
        if (count > 9n) {
          parts.push(`${count.toLocaleString()} × ${h.glyph}`);
        } else {
          parts.push(h.glyph.repeat(Number(count)));
        }
      }
    }
    return parts.length > 0 ? parts.join(' ') : '𓄤';
  }

  // --- Sieve of Ma'at Small Primes ---
  const SIEVE_PRIMES = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73];

  // --- Presets ---
  const PRESETS = {
    tutankhamun: {
      name: 'Tutankhamun',
      n: '5959',
      desc: 'Close primes: 59 × 101. Factors in only 3 steps!',
    },
    cleopatra: {
      name: 'Cleopatra',
      n: '8051',
      desc: 'Classical Fermat: 83 × 97. Factors in 8 steps.',
    },
    ramses: {
      name: 'Ramses II',
      n: '10969629527',
      desc: 'RSA Vulnerability: 104723 × 104749. Huge modulus factored in step 1!',
    },
    nefertiti: {
      name: 'Nefertiti',
      n: '1000000007',
      desc: 'Prime modulus: demonstrates full sieve rejection & trivial limit search.',
    },
  };

  // --- State ---
  let currentN = 5959n;
  let initialX = 78n;
  let currentStep = 0;
  let currentX = 78n;
  let currentR = 125n;
  let currentY = null;
  let isRunning = false;
  let isPaused = false;
  let delayMs = 60;
  let maxSteps = 2000;
  let connectionMode = 'connecting'; // 'ws' | 'rest' | 'connecting' | 'error'

  // WebSocket reference
  let ws = null;
  let restTimer = null;
  let restStepsQueue = [];
  let restStepIndex = 0;

  // DOM Elements
  const elStatusDot = document.getElementById('chamber-status-dot');
  const elStatusText = document.getElementById('chamber-status-text');
  const elInputN = document.getElementById('chamber-input-n');
  const elBtnPlay = document.getElementById('chamber-btn-play');
  const elBtnStep = document.getElementById('chamber-btn-step');
  const elBtnReset = document.getElementById('chamber-btn-reset');
  const elSliderSpeed = document.getElementById('chamber-slider-speed');
  const elSpeedLabel = document.getElementById('chamber-speed-label');

  // Stone Tablet Cartouches
  const elTabletN = document.getElementById('tablet-n');
  const elHieroglyphN = document.getElementById('hieroglyph-n');
  const elTabletX = document.getElementById('tablet-x');
  const elTabletR = document.getElementById('tablet-r');
  const elTabletY = document.getElementById('tablet-y');

  // Telemetry Metrics
  const elMetricStep = document.getElementById('metric-step');
  const elMetricX2 = document.getElementById('metric-x2');
  const elMetricSieve = document.getElementById('metric-sieve');
  const elMetricSquare = document.getElementById('metric-square');

  // Victory Banner
  const elResultBanner = document.getElementById('chamber-result-banner');
  const elResultFormula = document.getElementById('chamber-result-formula');
  const elResultMeta = document.getElementById('chamber-result-meta');

  // Sieve Grid
  const elSieveGrid = document.getElementById('chamber-sieve-grid');

  // Canvas
  const canvas = document.getElementById('chamber-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // --- Build Sieve Grid ---
  function initSieveGrid() {
    if (!elSieveGrid) return;
    elSieveGrid.innerHTML = '';
    SIEVE_PRIMES.forEach((p) => {
      const cell = document.createElement('div');
      cell.className = 'chamber-sieve-cell';
      cell.id = `sieve-prime-${p}`;
      cell.innerHTML = `
        <div class="cell-prime">mod ${p}</div>
        <div class="cell-status">—</div>
      `;
      elSieveGrid.appendChild(cell);
    });
  }

  function updateSieveVisuals(sievePassed, rejectedBy) {
    SIEVE_PRIMES.forEach((p) => {
      const cell = document.getElementById(`sieve-prime-${p}`);
      if (!cell) return;
      const statusEl = cell.querySelector('.cell-status');

      if (sievePassed) {
        cell.className = 'chamber-sieve-cell cell-passed';
        if (statusEl) statusEl.textContent = 'Residue';
      } else if (rejectedBy === p) {
        cell.className = 'chamber-sieve-cell cell-rejected';
        if (statusEl) statusEl.textContent = 'Reject';
      } else if (rejectedBy && p < rejectedBy) {
        cell.className = 'chamber-sieve-cell cell-passed';
        if (statusEl) statusEl.textContent = 'Residue';
      } else {
        cell.className = 'chamber-sieve-cell';
        if (statusEl) statusEl.textContent = '—';
      }
    });
  }

  function resetSieveVisuals() {
    SIEVE_PRIMES.forEach((p) => {
      const cell = document.getElementById(`sieve-prime-${p}`);
      if (!cell) return;
      cell.className = 'chamber-sieve-cell';
      const statusEl = cell.querySelector('.cell-status');
      if (statusEl) statusEl.textContent = '—';
    });
  }

  // --- Canvas Geometric Visualizer ---
  function renderCanvas(xVal, rVal, isSquare, yVal) {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Padding & dimensions
    const pad = 36;
    const drawSize = Math.min(width, height) - pad * 2;

    // Draw stone background texture
    ctx.fillStyle = '#0c0f14';
    ctx.fillRect(0, 0, width, height);

    // Draw outer boundary grid
    ctx.strokeStyle = '#1a222e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j <= height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // Outer Square: side represents x
    const xLeft = pad;
    const yTop = pad;
    const outerSide = drawSize;

    // Gradient for outer block (x^2)
    const blockGrad = ctx.createLinearGradient(xLeft, yTop, xLeft + outerSide, yTop + outerSide);
    blockGrad.addColorStop(0, '#2b3648');
    blockGrad.addColorStop(1, '#1b222d');

    ctx.fillStyle = blockGrad;
    ctx.fillRect(xLeft, yTop, outerSide, outerSide);

    // Outer border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(xLeft, yTop, outerSide, outerSide);

    // Inner Void calculation: void represents r = y^2
    let voidRatio = 0;
    if (xVal > 0n) {
      const floatX = Number(xVal);
      const floatR = Number(rVal);
      if (floatX > 0 && floatR >= 0) {
        // sqrt(r) / x ratio
        const approxY = Math.sqrt(floatR);
        voidRatio = Math.min(approxY / floatX, 0.95);
      }
    }

    const voidSide = outerSide * voidRatio;
    const voidX = xLeft + outerSide - voidSide;
    const voidY = yTop + outerSide - voidSide;

    if (voidSide > 2) {
      // Carved void styling
      if (isSquare && yVal !== null) {
        // Perfect Square: Golden inner void
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.fillRect(voidX, voidY, voidSide, voidSide);

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(voidX, voidY, voidSide, voidSide);

        // Highlight the remaining L-tromino (gnomon) representing n
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Top arm
        ctx.moveTo(xLeft, yTop);
        ctx.lineTo(xLeft + outerSide, yTop);
        ctx.lineTo(xLeft + outerSide, voidY);
        ctx.lineTo(voidX, voidY);
        ctx.lineTo(voidX, yTop + outerSide);
        ctx.lineTo(xLeft, yTop + outerSide);
        ctx.closePath();
        ctx.stroke();

        // Label inside void
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 13px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`y² = ${yVal}²`, voidX + voidSide / 2, voidY + voidSide / 2 + 5);
      } else {
        // Imperfect void: Jagged or amber cut indicating non-square
        ctx.fillStyle = 'rgba(192, 57, 43, 0.18)';
        ctx.fillRect(voidX, voidY, voidSide, voidSide);

        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(voidX, voidY, voidSide, voidSide);
        ctx.setLineDash([]);

        ctx.fillStyle = '#e74c3c';
        ctx.font = '11px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`r = ${rVal}`, voidX + voidSide / 2, voidY + voidSide / 2 + 4);
      }
    }

    // Outer dimension labels
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 12px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`x = ${xVal}`, xLeft + outerSide / 2, yTop - 10);

    ctx.save();
    ctx.translate(xLeft - 10, yTop + outerSide / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(`x = ${xVal}`, 0, 0);
    ctx.restore();

    // Area readout
    ctx.fillStyle = isSquare ? '#2ecc71' : '#f4ecd8';
    ctx.font = '12px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Area: x² - y² = ${currentN}`, xLeft + 6, yTop + 20);
  }

  // --- UI Update Helpers ---
  function updateTelemetry(step, x, r, sievePassed, rejectedBy, isSquare, y) {
    currentStep = step;
    currentX = BigInt(x);
    currentR = BigInt(r);
    currentY = y !== null && y !== undefined ? BigInt(y) : null;

    if (elMetricStep) elMetricStep.textContent = String(step);
    if (elTabletX) elTabletX.textContent = String(x);
    if (elTabletR) elTabletR.textContent = String(r);
    if (elTabletY) elTabletY.textContent = y !== null && y !== undefined ? String(y) : '—';

    const x2 = currentX * currentX;
    if (elMetricX2) elMetricX2.textContent = String(x2);

    if (elMetricSieve) {
      if (sievePassed) {
        elMetricSieve.innerHTML = '<span style="color:var(--chamber-emerald-bright)">Passed Sieve</span>';
      } else if (rejectedBy) {
        elMetricSieve.innerHTML = `<span style="color:var(--chamber-carnelian-bright)">Rejected (mod ${rejectedBy})</span>`;
      } else {
        elMetricSieve.textContent = 'Testing...';
      }
    }

    if (elMetricSquare) {
      if (isSquare && y !== null) {
        elMetricSquare.innerHTML = `<span style="color:var(--chamber-gold-bright)">Perfect Square (${y}²)</span>`;
      } else {
        elMetricSquare.innerHTML = '<span style="color:var(--chamber-muted)">Not a Square</span>';
      }
    }

    updateSieveVisuals(sievePassed, rejectedBy);
    renderCanvas(currentX, currentR, isSquare, currentY);
  }

  function showFoundResult(p, q, x, y, elapsedUs, step) {
    isRunning = false;
    isPaused = false;
    updatePlayButton();

    if (elResultBanner) {
      elResultBanner.style.display = 'block';
    }
    if (elResultFormula) {
      elResultFormula.innerHTML = `
        ${currentN} = (${x} - ${y}) × (${x} + ${y})<br>
        <span style="color:var(--chamber-gold-bright); font-size:1.4rem;">= ${p} × ${q}</span>
      `;
    }
    if (elResultMeta) {
      const ms = (Number(elapsedUs) / 1000).toFixed(2);
      elResultMeta.textContent = `Factored in ${step} iterations (${ms} ms / ${elapsedUs} µs). Both factors non-trivial!`;
    }
  }

  function showTrivialResult(p, q, step) {
    isRunning = false;
    isPaused = false;
    updatePlayButton();

    if (elResultBanner) {
      elResultBanner.style.display = 'block';
    }
    if (elResultFormula) {
      elResultFormula.innerHTML = `
        ${currentN} has no non-trivial difference of squares!<br>
        <span style="color:#ffd700;">Trivial factors: 1 × ${currentN}</span>
      `;
    }
    if (elResultMeta) {
      elResultMeta.textContent = `The candidate reached (n+1)/2 at step ${step}. This confirms ${currentN} is prime.`;
    }
  }

  function updatePlayButton() {
    if (!elBtnPlay) return;
    if (isRunning && !isPaused) {
      elBtnPlay.textContent = '❚❚ Pause';
      elBtnPlay.classList.remove('chamber-btn-primary');
      elBtnPlay.classList.add('chamber-btn-secondary');
    } else if (isRunning && isPaused) {
      elBtnPlay.textContent = '▶ Resume';
      elBtnPlay.classList.add('chamber-btn-primary');
      elBtnPlay.classList.remove('chamber-btn-secondary');
    } else {
      elBtnPlay.textContent = '▶ Enter Chamber';
      elBtnPlay.classList.add('chamber-btn-primary');
      elBtnPlay.classList.remove('chamber-btn-secondary');
    }
  }

  function setStatusBadge(mode, text) {
    connectionMode = mode;
    if (elStatusDot) {
      elStatusDot.className = `chamber-status-dot ${mode}`;
    }
    if (elStatusText) {
      elStatusText.textContent = text;
    }
  }

  // --- WebSocket Connection ---
  function getWsUrl() {
    const isHttps = window.location.protocol === 'https:';
    const proto = isHttps ? 'wss:' : 'ws:';
    const host = window.location.host;
    // When served under abhrankan.duckdns.org or localhost
    if (host.includes('abhrankan.duckdns.org')) {
      return `${proto}//${host}/crypto-api/v1/math/chamber/ws`;
    }
    return `${proto}//127.0.0.1:8089/v1/math/chamber/ws`;
  }

  function initWebSocket() {
    const url = getWsUrl();
    setStatusBadge('connecting', 'Connecting to Chamber WebSocket...');

    try {
      ws = new WebSocket(url);
    } catch {
      fallbackToRest('WebSocket initialization failed; using REST engine.');
      return;
    }

    ws.onopen = () => {
      setStatusBadge('connected', 'Live WebSocket Stream Active');
    };

    ws.onmessage = (evt) => {
      let data;
      try {
        data = JSON.parse(evt.data);
      } catch {
        return;
      }

      switch (data.type) {
        case 'start':
          currentN = BigInt(data.n);
          initialX = BigInt(data.initial_x);
          currentStep = 0;
          currentX = initialX;
          currentY = null;
          updateTelemetry(0, initialX, initialX * initialX - currentN, false, null, false, null);
          break;

        case 'step':
          updateTelemetry(data.step, data.x, data.r, data.sieve_passed, data.rejected_by, data.is_square, null);
          break;

        case 'candidate':
          updateTelemetry(data.step, data.x, data.r, data.sieve_passed, null, data.is_square, data.y);
          break;

        case 'found':
          showFoundResult(data.p, data.q, data.x, data.y, data.elapsed_us, data.step);
          break;

        case 'done':
          if (data.reason === 'found') {
            // Already handled by found frame
          } else if (data.reason === 'trivial') {
            showTrivialResult(data.p, data.q, data.step);
          } else if (data.reason === 'max_steps') {
            isRunning = false;
            updatePlayButton();
            if (elMetricSieve) {
              elMetricSieve.innerHTML = `<span style="color:var(--chamber-gold)">Paused (reached max steps)</span>`;
            }
          } else if (data.reason === 'stopped') {
            isRunning = false;
            updatePlayButton();
          }
          break;

        case 'error':
          alert(`Chamber Error: ${data.message}`);
          isRunning = false;
          updatePlayButton();
          break;
      }
    };

    ws.onerror = () => {
      fallbackToRest('WebSocket unavailable; switched to REST simulation engine.');
    };

    ws.onclose = () => {
      if (connectionMode === 'connected') {
        setStatusBadge('fallback', 'WebSocket closed; falling back to REST.');
      }
    };
  }

  // --- REST Fallback Engine ---
  function fallbackToRest(message) {
    setStatusBadge('fallback', message || 'REST Simulation Active');
  }

  async function fetchRestFactorization(nVal) {
    const isHttps = window.location.protocol === 'https:';
    const proto = isHttps ? 'https:' : 'http:';
    const host = window.location.host;
    const base = host.includes('abhrankan.duckdns.org')
      ? `${proto}//${host}/crypto-api/v1/math/fermat`
      : 'http://127.0.0.1:8089/v1/math/fermat';

    const resp = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n: nVal.toString(), max_steps: maxSteps, record_steps: true }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }

  function startRestPlayback(summary) {
    restStepsQueue = summary.steps || [];
    restStepIndex = 0;
    isRunning = true;
    isPaused = false;
    updatePlayButton();

    function tick() {
      if (!isRunning || isPaused) return;

      if (restStepIndex < restStepsQueue.length) {
        const stepData = restStepsQueue[restStepIndex++];
        updateTelemetry(
          stepData.step,
          stepData.x,
          stepData.r,
          stepData.sieve_passed,
          stepData.rejected_by,
          stepData.is_square,
          stepData.y
        );

        if (stepData.is_square && summary.found) {
          showFoundResult(summary.p, summary.q, summary.x, summary.y, summary.elapsed_us, summary.steps_count);
          return;
        }

        restTimer = setTimeout(tick, delayMs);
      } else {
        if (summary.found) {
          showFoundResult(summary.p, summary.q, summary.x, summary.y, summary.elapsed_us, summary.steps_count);
        } else if (summary.reason === 'trivial') {
          showTrivialResult(summary.p, summary.q, summary.steps_count);
        } else {
          isRunning = false;
          updatePlayButton();
        }
      }
    }

    tick();
  }

  // --- Control Actions ---
  function startFactorization() {
    if (elResultBanner) elResultBanner.style.display = 'none';
    resetSieveVisuals();

    const nStr = elInputN ? elInputN.value.trim() : '5959';
    try {
      currentN = BigInt(nStr);
    } catch {
      alert('Please enter a valid positive integer.');
      return;
    }

    if (currentN < 3n || currentN % 2n === 0n) {
      alert('n must be an odd integer >= 3 for Fermat difference of squares.');
      return;
    }

    // Update cartouche headers
    if (elTabletN) elTabletN.textContent = currentN.toLocaleString();
    if (elHieroglyphN) elHieroglyphN.textContent = toHieroglyphs(currentN);

    // Initial integer square root ceiling
    initialX = BigInt(Math.ceil(Math.sqrt(Number(currentN))));
    currentX = initialX;
    currentR = currentX * currentX - currentN;

    updateTelemetry(0, currentX, currentR, false, null, false, null);

    if (ws && ws.readyState === WebSocket.OPEN) {
      isRunning = true;
      isPaused = false;
      updatePlayButton();
      ws.send(
        JSON.stringify({
          action: 'start',
          n: currentN.toString(),
          delay_ms: delayMs,
          max_steps: maxSteps,
        })
      );
    } else {
      // Fallback REST path
      fetchRestFactorization(currentN)
        .then((summary) => {
          startRestPlayback(summary);
        })
        .catch((err) => {
          alert(`Factorization failed: ${err.message}`);
          isRunning = false;
          updatePlayButton();
        });
    }
  }

  function togglePlayPause() {
    if (!isRunning) {
      startFactorization();
    } else if (isPaused) {
      isPaused = false;
      updatePlayButton();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'resume' }));
      } else {
        // Resume REST timer
        if (restStepsQueue.length > 0) {
          startRestPlayback({ steps: restStepsQueue, found: false });
        }
      }
    } else {
      isPaused = true;
      updatePlayButton();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'pause' }));
      } else {
        clearTimeout(restTimer);
      }
    }
  }

  function stepOnce() {
    if (elResultBanner) elResultBanner.style.display = 'none';

    if (!isRunning) {
      startFactorization();
      isPaused = true;
      updatePlayButton();
      return;
    }

    isPaused = true;
    updatePlayButton();

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'step' }));
    } else if (restStepIndex < restStepsQueue.length) {
      const stepData = restStepsQueue[restStepIndex++];
      updateTelemetry(
        stepData.step,
        stepData.x,
        stepData.r,
        stepData.sieve_passed,
        stepData.rejected_by,
        stepData.is_square,
        stepData.y
      );
    }
  }

  function resetChamber() {
    clearTimeout(restTimer);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'stop' }));
    }

    isRunning = false;
    isPaused = false;
    currentStep = 0;
    updatePlayButton();

    if (elResultBanner) elResultBanner.style.display = 'none';
    resetSieveVisuals();

    const nStr = elInputN ? elInputN.value.trim() : '5959';
    try {
      currentN = BigInt(nStr);
    } catch {
      currentN = 5959n;
    }

    if (elTabletN) elTabletN.textContent = currentN.toLocaleString();
    if (elHieroglyphN) elHieroglyphN.textContent = toHieroglyphs(currentN);

    initialX = BigInt(Math.ceil(Math.sqrt(Number(currentN))));
    currentX = initialX;
    currentR = currentX * currentX - currentN;

    updateTelemetry(0, currentX, currentR, false, null, false, null);
  }

  function selectPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    // Highlight button
    document.querySelectorAll('.chamber-preset-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.preset === presetKey);
    });

    if (elInputN) {
      elInputN.value = preset.n;
    }

    resetChamber();
  }

  // --- Event Listeners Initialization ---
  function init() {
    initSieveGrid();

    // Preset buttons
    document.querySelectorAll('.chamber-preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectPreset(btn.dataset.preset);
      });
    });

    // Input changes
    if (elInputN) {
      elInputN.addEventListener('input', () => {
        const val = elInputN.value.trim();
        if (elTabletN) elTabletN.textContent = val || '—';
        if (elHieroglyphN) elHieroglyphN.textContent = toHieroglyphs(val);
      });
    }

    // Play, Step, Reset buttons
    if (elBtnPlay) elBtnPlay.addEventListener('click', togglePlayPause);
    if (elBtnStep) elBtnStep.addEventListener('click', stepOnce);
    if (elBtnReset) elBtnReset.addEventListener('click', resetChamber);

    // Speed Slider
    if (elSliderSpeed) {
      elSliderSpeed.addEventListener('input', () => {
        delayMs = parseInt(elSliderSpeed.value, 10);
        if (elSpeedLabel) elSpeedLabel.textContent = `${delayMs} ms`;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: 'speed', delay_ms: delayMs }));
        }
      });
    }

    // Initial render with default 5959
    selectPreset('tutankhamun');

    // Connect WebSocket
    initWebSocket();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
