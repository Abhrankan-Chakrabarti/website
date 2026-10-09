const API_BASE =
  window.LAB_API_BASE ||
  (window.location.protocol === "file:" ? "https://abhrankan.duckdns.org/api" : "/api");
const CRYPTO_API_BASE =
  window.CRYPTO_API_BASE ||
  (window.location.protocol === "file:"
    ? "https://abhrankan.duckdns.org/crypto-api"
    : "/crypto-api");

const healthBadge = document.querySelector("#health-badge");
const healthMessage = document.querySelector("#health-message");
const refreshHealthButton = document.querySelector("#refresh-health");
const catalanForm = document.querySelector("#catalan-form");
const catalanInput = document.querySelector("#catalan-n");
const catalanResult = document.querySelector("#catalan-result");
const clearCatalanButton = document.querySelector("#clear-catalan");
const fibonacciForm = document.querySelector("#fibonacci-form");
const fibonacciInput = document.querySelector("#fibonacci-n");
const fibonacciResult = document.querySelector("#fibonacci-result");
const clearFibonacciButton = document.querySelector("#clear-fibonacci");
const gcdForm = document.querySelector("#gcd-form");
const gcdAInput = document.querySelector("#gcd-a");
const gcdBInput = document.querySelector("#gcd-b");
const gcdResult = document.querySelector("#gcd-result");
const clearGcdButton = document.querySelector("#clear-gcd");
const primeForm = document.querySelector("#prime-form");
const primeInput = document.querySelector("#prime-n");
const primeResult = document.querySelector("#prime-result");
const clearPrimeButton = document.querySelector("#clear-prime");
const nextPrimeForm = document.querySelector("#next-prime-form");
const nextPrimeInput = document.querySelector("#next-prime-n");
const nextPrimeResult = document.querySelector("#next-prime-result");
const clearNextPrimeButton = document.querySelector("#clear-next-prime");
const primeGapForm = document.querySelector("#prime-gap-form");
const primeGapInput = document.querySelector("#prime-gap-n");
const primeGapResult = document.querySelector("#prime-gap-result");
const clearPrimeGapButton = document.querySelector("#clear-prime-gap");
const primePiForm = document.querySelector("#prime-pi-form");
const primePiInput = document.querySelector("#prime-pi-n");
const primePiResult = document.querySelector("#prime-pi-result");
const clearPrimePiButton = document.querySelector("#clear-prime-pi");
const factorForm = document.querySelector("#factor-form");
const factorInput = document.querySelector("#factor-n");
const factorResult = document.querySelector("#factor-result");
const clearFactorButton = document.querySelector("#clear-factor");
const totientForm = document.querySelector("#totient-form");
const totientInput = document.querySelector("#totient-n");
const totientResult = document.querySelector("#totient-result");
const clearTotientButton = document.querySelector("#clear-totient");
const mobiusForm = document.querySelector("#mobius-form");
const mobiusInput = document.querySelector("#mobius-n");
const mobiusResult = document.querySelector("#mobius-result");
const clearMobiusButton = document.querySelector("#clear-mobius");
const refreshInfoButton = document.querySelector("#refresh-info");
const infoOutput = document.querySelector("#info-output");
const refreshCryptoInfoButton = document.querySelector("#refresh-crypto-info");
const cryptoInfoOutput = document.querySelector("#crypto-info-output");
const snapshotForm = document.querySelector("#snapshot-form");
const snapshotUsername = document.querySelector("#snapshot-username");
const snapshotPassword = document.querySelector("#snapshot-password");
const snapshotOutput = document.querySelector("#snapshot-output");
const clearSnapshotButton = document.querySelector("#clear-snapshot");
const hashForm = document.querySelector("#hash-form");
const hashAlgorithm = document.querySelector("#hash-algorithm");
const hashData = document.querySelector("#hash-data");
const hashUsername = document.querySelector("#hash-username");
const hashPassword = document.querySelector("#hash-password");
const hashResult = document.querySelector("#hash-result");
const clearHashButton = document.querySelector("#clear-hash");
const hmacForm = document.querySelector("#hmac-form");
const hmacOperation = document.querySelector("#hmac-operation");
const hmacAlgorithm = document.querySelector("#hmac-algorithm");
const hmacKey = document.querySelector("#hmac-key");
const hmacData = document.querySelector("#hmac-data");
const hmacMacLabel = document.querySelector("#hmac-mac-label");
const hmacMac = document.querySelector("#hmac-mac");
const hmacUsername = document.querySelector("#hmac-username");
const hmacPassword = document.querySelector("#hmac-password");
const hmacResult = document.querySelector("#hmac-result");
const clearHmacButton = document.querySelector("#clear-hmac");
const cryptoHealthBadge = document.querySelector("#crypto-health-badge");
const cryptoHealthMessage = document.querySelector("#crypto-health-message");
const refreshCryptoHealthButton = document.querySelector("#refresh-crypto-health");
const stegoInput = document.querySelector("#stego-input");
const stegoResults = document.querySelector("#stego-results");
const stegoLsbStream = document.querySelector("#stego-lsb-stream");

function endpoint(path) {
  return `${API_BASE.replace(/\/$/, "")}${path}`;
}

function setBusy(button, isBusy, label) {
  button.disabled = isBusy;
  if (label) {
    button.dataset.idleLabel ||= button.textContent;
    button.textContent = isBusy ? label : button.dataset.idleLabel;
  }
}

async function fetchJson(path, options = {}, result, curlOptions = {}) {
  return requestJson(
    endpoint(path),
    `/api${path}`,
    options,
    result,
    curlOptions,
  );
}

async function fetchCryptoJson(path, options = {}, result, curlOptions = {}) {
  return requestJson(
    `${CRYPTO_API_BASE.replace(/\/$/, "")}${path}`,
    `/crypto-api${path}`,
    options,
    result,
    curlOptions,
  );
}

async function requestJson(
  url,
  path,
  options = {},
  result,
  curlOptions = {},
) {
  const startedAt = performance.now();
  const method = (options.method || "GET").toUpperCase();
  let response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch (error) {
    renderTelemetry(
      result,
      method,
      path,
      null,
      performance.now() - startedAt,
      curlOptions,
    );
    throw error;
  }

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  renderTelemetry(
    result,
    method,
    path,
    response,
    performance.now() - startedAt,
    curlOptions,
  );

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? body.error
        : `Request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

function renderTelemetry(
  result,
  method,
  path,
  response,
  elapsedMs,
  curlOptions = {},
) {
  if (!result) return;
  let telemetry = result.nextElementSibling;
  if (!telemetry?.matches(".lab-telemetry")) {
    telemetry = document.createElement("small");
    telemetry.className = "lab-telemetry";
    result.insertAdjacentElement("afterend", telemetry);
  }

  const latency = `${Math.round(elapsedMs)} ms`;
  telemetry.replaceChildren();
  telemetry.className = "lab-telemetry";
  const metadata = document.createElement("div");
  metadata.className = "telemetry-meta";
  const icon = document.createElement("span");
  icon.className = "telemetry-icon";
  icon.textContent = "⚡";
  const latencyText = document.createElement("span");
  latencyText.textContent = latency;
  const firstSeparator = document.createElement("span");
  firstSeparator.className = "telemetry-separator";
  firstSeparator.textContent = "·";
  const request = document.createElement("span");
  request.className = "telemetry-path";
  request.title = `${method} ${path}`;
  request.textContent = `${method} ${path}`;
  const secondSeparator = document.createElement("span");
  secondSeparator.className = "telemetry-separator";
  secondSeparator.textContent = "·";
  const statusText = document.createElement("span");
  if (response) {
    statusText.textContent = `${response.status} ${response.statusText || ""}`.trim();
  } else {
    statusText.textContent = "Network error";
  }
  metadata.append(
    icon,
    latencyText,
    firstSeparator,
    request,
    secondSeparator,
    statusText,
  );
  telemetry.append(metadata, createCurlButton(method, path, curlOptions));
}

function createCurlButton(method, path, curlOptions) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "curl-copy-btn";
  button.title = "Copy cURL command";
  button.textContent = "cURL";
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    const originalText = button.textContent;
    try {
      await copyText(buildCurlCommand(method, path, curlOptions));
      button.textContent = "Copied!";
      button.classList.add("curl-copy-btn--copied");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("curl-copy-btn--copied");
      }, 1500);
    } catch (error) {
      button.textContent = "Copy failed";
      console.error("Clipboard copy failed:", error);
    }
  });
  return button;
}

function buildCurlCommand(method, path, { authUser, body } = {}) {
  const origin =
    window.location.protocol === "file:"
      ? "https://abhrankan.duckdns.org"
      : window.location.origin;
  const parts = [`curl -i -X ${method} '${origin}${path}'`];
  if (authUser) {
    parts.push(`-u '${shellQuote(authUser)}:<password>'`);
  }
  if (body && (method === "POST" || method === "PUT")) {
    parts.push(`-H 'Content-Type: application/json'`);
    parts.push(`-d '${shellQuote(JSON.stringify(body))}'`);
  }
  return parts.join(" ");
}

function shellQuote(value) {
  return String(value).replace(/'/g, "'\"'\"'");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Clipboard access is unavailable.");
  }
}

function initStegoInspector() {
  if (!stegoInput || !stegoResults || !stegoLsbStream) return;
  let byteBuffer = [];
  let baselineBuffer = [];
  const invertButton = document.querySelector("#stego-btn-invert");
  const clearLsbButton = document.querySelector("#stego-btn-clear-lsb");
  const xorMaskButton = document.querySelector("#stego-btn-xor-mask");
  const resetButton = document.querySelector("#stego-btn-reset");
  const hammingWeight = document.querySelector("#stego-hamming-weight");
  const totalBits = document.querySelector("#stego-total-bits");
  const hammingDistance = document.querySelector("#stego-hamming-distance");

  function countSetBits(value) {
    let count = 0;
    while (value > 0) {
      count += value & 1;
      value >>= 1;
    }
    return count;
  }

  function renderMetrics() {
    const weight = byteBuffer.reduce((total, byte) => total + countSetBits(byte), 0);
    const distance = byteBuffer.reduce(
      (total, byte, index) =>
        total + countSetBits(byte ^ (baselineBuffer[index] ?? 0)),
      0,
    );
    if (hammingWeight) hammingWeight.textContent = String(weight);
    if (totalBits) totalBits.textContent = String(byteBuffer.length * 8);
    if (hammingDistance) {
      hammingDistance.textContent = String(distance);
      hammingDistance.style.color = distance > 0 ? "#f59e0b" : "#71717a";
    }
  }

  function render() {
    stegoResults.replaceChildren();

    if (byteBuffer.length === 0) {
      const emptyMessage = document.createElement("span");
      emptyMessage.className = "lab-muted";
      emptyMessage.textContent = "Enter text above to inspect bit breakdown.";
      stegoResults.append(emptyMessage);
      stegoLsbStream.textContent = "—";
      renderMetrics();
      return;
    }

    let lsbStream = "";
    byteBuffer.forEach((byte, index) => {
      const binary = byte.toString(2).padStart(8, "0");
      const row = document.createElement("div");
      row.className = "stego-byte";

      const metadata = document.createElement("div");
      metadata.className = "stego-byte-meta";
      const indexElement = document.createElement("span");
      indexElement.className = "stego-index";
      indexElement.textContent = `[${index}]`;
      const character = document.createElement("span");
      character.className = "stego-character";
      character.textContent =
        byte >= 32 && byte <= 126 ? `'${String.fromCharCode(byte)}'` : "'·'";
      const hex = document.createElement("span");
      hex.className = "stego-hex";
      hex.textContent = `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`;
      const decimal = document.createElement("span");
      decimal.className = "stego-decimal";
      decimal.textContent = `(${byte})`;
      metadata.append(indexElement, character, hex, decimal);

      const bits = document.createElement("div");
      bits.className = "stego-bits";
      binary.split("").forEach((bit, bitIndex) => {
        const bitElement = document.createElement("button");
        bitElement.type = "button";
        bitElement.className = `stego-bit${bitIndex === 7 ? " stego-bit--lsb" : ""}`;
        bitElement.dataset.byte = String(index);
        bitElement.dataset.bit = String(bitIndex);
        bitElement.setAttribute("aria-label", `Flip bit ${7 - bitIndex} of byte ${index}`);
        bitElement.setAttribute("aria-pressed", bit === "1" ? "true" : "false");
        bitElement.title = `Click to flip bit ${7 - bitIndex} (weight: ${1 << (7 - bitIndex)})`;
        bitElement.textContent = bit;
        bits.append(bitElement);
      });

      lsbStream += binary[7];
      row.append(metadata, bits);
      stegoResults.append(row);
    });
    stegoLsbStream.textContent = lsbStream;
    renderMetrics();
  }

  function syncFromInput() {
    byteBuffer = Array.from(new TextEncoder().encode(stegoInput.value));
    baselineBuffer = [...byteBuffer];
    render();
  }

  function syncToInput() {
    const decoder = new TextDecoder("utf-8", { fatal: false });
    stegoInput.value = decoder.decode(new Uint8Array(byteBuffer));
    render();
  }

  stegoInput.addEventListener("input", syncFromInput);
  stegoResults.addEventListener("click", (event) => {
    const button = event.target.closest(".stego-bit");
    if (!button) return;
    const byteIndex = Number(button.dataset.byte);
    const bitIndex = Number(button.dataset.bit);
    byteBuffer[byteIndex] ^= 1 << (7 - bitIndex);
    syncToInput();
  });
  invertButton?.addEventListener("click", () => {
    byteBuffer = byteBuffer.map((byte) => byte ^ 0xff);
    syncToInput();
  });
  clearLsbButton?.addEventListener("click", () => {
    byteBuffer = byteBuffer.map((byte) => byte & 0xfe);
    syncToInput();
  });
  xorMaskButton?.addEventListener("click", () => {
    byteBuffer = byteBuffer.map((byte) => byte ^ 0x20);
    syncToInput();
  });
  resetButton?.addEventListener("click", () => {
    stegoInput.value = "fox";
    syncFromInput();
  });
  syncFromInput();
}

function clearTelemetry(result) {
  result?.nextElementSibling?.matches(".lab-telemetry") &&
    result.nextElementSibling.remove();
}

function basicAuth(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function operationOptions(username, password, payload) {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: basicAuth(username, password),
    },
    body: JSON.stringify(payload),
  };
}

async function runHash(event) {
  event.preventDefault();
  const button = hashForm.querySelector("button");
  const username = hashUsername.value.trim();
  const password = hashPassword.value;

  hashResult.textContent = "Hashing...";
  setBusy(button, true, "Hashing");

  try {
    const data = await fetchCryptoJson(
      "/v1/hash",
      operationOptions(username, password, {
        algorithm: hashAlgorithm.value,
        data: hashData.value,
      }),
      hashResult,
      { authUser: username, body: { algorithm: hashAlgorithm.value, data: hashData.value } },
    );
    hashResult.textContent = data.digest;
  } catch (error) {
    hashResult.textContent = error.message;
  } finally {
    hashPassword.value = "";
    setBusy(button, false, "Hashing");
  }
}

function clearCatalan() {
  catalanInput.value = "5";
  validateCatalanInput();
  catalanResult.textContent = "Ready to calculate.";
  clearTelemetry(catalanResult);
}

function clearHash() {
  hashData.value = "hello";
  hashUsername.value = "";
  hashPassword.value = "";
  hashResult.textContent = "Your digest will appear here.";
  clearTelemetry(hashResult);
}

function validateCatalanInput() {
  return validateBoundedIntegerInput(
    catalanInput,
    0,
    34,
    "Enter an integer from 0 to 34.",
    catalanResult,
  );
}

function validateFibonacciInput() {
  return validateBoundedIntegerInput(
    fibonacciInput,
    0,
    186,
    "Enter an integer from 0 to 186.",
    fibonacciResult,
  );
}

function validateBoundedIntegerInput(input, minimum, maximum, message, result) {
  const value = input.value.trim();
  const number = Number(value);
  const valid =
    value !== "" &&
    Number.isInteger(number) &&
    number >= minimum &&
    number <= maximum;
  input.setCustomValidity(valid ? "" : message);
  if (result) {
    if (!valid) {
      result.textContent = message;
    } else if (result.textContent === message) {
      result.textContent = "Ready to calculate.";
    }
  }
  return valid;
}

async function lookupFibonacci(event) {
  event.preventDefault();

  const n = Number(fibonacciInput.value);
  if (!Number.isInteger(n) || n < 0 || n > 186) {
    fibonacciResult.textContent = "Enter an integer from 0 to 186.";
    return;
  }

  const button = fibonacciForm.querySelector("button[type='submit']");
  fibonacciResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");

  try {
    const data = await fetchJson(`/v1/math/fibonacci/${n}`, {}, fibonacciResult);
    fibonacciResult.innerHTML = `F<sub>${data.n}</sub> = <strong>${data.value}</strong>`;
  } catch (error) {
    fibonacciResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

async function lookupGcd(event) {
  event.preventDefault();

  const { a, b } = validateGcdInputs();
  if (a === null || b === null) {
    return;
  }

  const button = gcdForm.querySelector("button[type='submit']");
  gcdResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");

  try {
    await fetchJson(`/v1/math/gcd/${a}/${b}`, {}, gcdResult);
    let x = a;
    let y = b;
    while (y !== 0n) {
      [x, y] = [y, x % y];
    }
    gcdResult.innerHTML = `gcd(${a}, ${b}) = <strong>${x}</strong>`;
  } catch (error) {
    gcdResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

function validateGcdInput(input) {
  const value = input.value.trim();
  const message = "Enter an integer from 0 to 18,446,744,073,709,551,615.";
  let parsed = null;

  if (/^\d+$/.test(value)) {
    try {
      const candidate = BigInt(value);
      if (candidate <= 18446744073709551615n) {
        parsed = candidate;
      }
    } catch {
      // The regular expression guarantees a decimal integer, but keep the
      // validation defensive for browsers with unusual BigInt behavior.
    }
  }

  input.setCustomValidity(parsed === null ? message : "");
  return parsed;
}

function validateGcdInputs() {
  const message =
    "Enter two integers from 0 to 18,446,744,073,709,551,615.";
  const a = validateGcdInput(gcdAInput);
  const b = validateGcdInput(gcdBInput);
  if (a === null || b === null) {
    gcdResult.textContent = message;
  } else if (gcdResult.textContent === message) {
    gcdResult.textContent = "Ready to calculate.";
  }
  return { a, b };
}

function clearFibonacci() {
  fibonacciInput.value = "10";
  validateFibonacciInput();
  fibonacciResult.textContent = "Ready to calculate.";
  clearTelemetry(fibonacciResult);
}

function clearGcd() {
  gcdAInput.value = "84";
  gcdBInput.value = "30";
  validateGcdInputs();
  gcdResult.textContent = "Ready to calculate.";
  clearTelemetry(gcdResult);
}

function primeInputValue(input, result, minimum) {
  const n = Number(input.value);
  if (!Number.isSafeInteger(n) || n < minimum || n > 1000000) {
    result.textContent = `Enter an integer from ${minimum.toLocaleString()} to 1,000,000.`;
    return null;
  }
  return n;
}

function validatePrimeInput(input, minimum, result) {
  return validateBoundedIntegerInput(
    input,
    minimum,
    1000000,
    `Enter an integer from ${minimum.toLocaleString()} to 1,000,000.`,
    result,
  );
}

async function lookupPrime(event) {
  event.preventDefault();
  const n = primeInputValue(primeInput, primeResult, 0);
  if (n === null) return;
  const button = primeForm.querySelector("button[type='submit']");
  primeResult.textContent = "Checking...";
  setBusy(button, true, "Checking");
  try {
    const data = await fetchJson(`/v1/math/is-prime/${n}`, {}, primeResult);
    primeResult.innerHTML = `${data.n} is <strong>${data.prime ? "" : "not "}prime</strong>`;
  } catch (error) {
    primeResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Checking");
  }
}

async function lookupNextPrime(event) {
  event.preventDefault();
  const n = primeInputValue(nextPrimeInput, nextPrimeResult, 0);
  if (n === null) return;
  const button = nextPrimeForm.querySelector("button[type='submit']");
  nextPrimeResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchJson(`/v1/math/next-prime/${n}`, {}, nextPrimeResult);
    nextPrimeResult.innerHTML = `Next prime after ${data.n} = <strong>${data.value}</strong>`;
  } catch (error) {
    nextPrimeResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

async function lookupPrimeGap(event) {
  event.preventDefault();
  const n = primeInputValue(primeGapInput, primeGapResult, 3);
  if (n === null) return;
  const button = primeGapForm.querySelector("button[type='submit']");
  primeGapResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchJson(`/v1/math/prime-gap/${n}`, {}, primeGapResult);
    primeGapResult.innerHTML = `${data.previous_prime} and ${data.next_prime}; gap = <strong>${data.gap}</strong>`;
  } catch (error) {
    primeGapResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

async function lookupPrimePi(event) {
  event.preventDefault();
  const n = primeInputValue(primePiInput, primePiResult, 0);
  if (n === null) return;
  const button = primePiForm.querySelector("button[type='submit']");
  primePiResult.textContent = "Counting...";
  setBusy(button, true, "Counting");
  try {
    const data = await fetchJson(`/v1/math/prime-pi/${n}`, {}, primePiResult);
    primePiResult.innerHTML = `π(${data.n}) = <strong>${data.value}</strong>`;
  } catch (error) {
    primePiResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Counting");
  }
}

async function lookupFactor(event) {
  event.preventDefault();
  const n = primeInputValue(factorInput, factorResult, 0);
  if (n === null) return;
  const button = factorForm.querySelector("button[type='submit']");
  factorResult.textContent = "Factoring...";
  setBusy(button, true, "Factoring");
  try {
    const data = await fetchJson(`/v1/math/factor/${n}`, {}, factorResult);
    if (!Array.isArray(data.factors) || !data.factors.every(
      (factor) => Number.isInteger(factor.prime) && Number.isInteger(factor.power),
    )) {
      throw new Error("The API returned an invalid factorisation.");
    }
    const factors = data.factors.length
      ? data.factors.map((factor) => `${factor.prime}^${factor.power}`).join(" × ")
      : "no prime factors";
    factorResult.textContent = `${data.n} = ${factors}`;
  } catch (error) {
    factorResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Factoring");
  }
}

async function lookupTotient(event) {
  event.preventDefault();
  const n = primeInputValue(totientInput, totientResult, 0);
  if (n === null) return;
  const button = totientForm.querySelector("button[type='submit']");
  totientResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchJson(`/v1/math/totient/${n}`, {}, totientResult);
    totientResult.textContent = `φ(${data.n}) = ${data.value}`;
  } catch (error) {
    totientResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

async function lookupMobius(event) {
  event.preventDefault();
  const n = primeInputValue(mobiusInput, mobiusResult, 0);
  if (n === null) return;
  const button = mobiusForm.querySelector("button[type='submit']");
  mobiusResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchJson(`/v1/math/mobius/${n}`, {}, mobiusResult);
    mobiusResult.textContent = `μ(${data.n}) = ${data.value}`;
  } catch (error) {
    mobiusResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

function clearPrime() {
  primeInput.value = "97";
  validatePrimeInput(primeInput, 0, primeResult);
  primeResult.textContent = "Ready to calculate.";
  clearTelemetry(primeResult);
}

function clearFactor() {
  factorInput.value = "360";
  validatePrimeInput(factorInput, 0, factorResult);
  factorResult.textContent = "Ready to calculate.";
  clearTelemetry(factorResult);
}

function clearTotient() {
  totientInput.value = "36";
  validatePrimeInput(totientInput, 0, totientResult);
  totientResult.textContent = "Ready to calculate.";
  clearTelemetry(totientResult);
}

function clearMobius() {
  mobiusInput.value = "30";
  validatePrimeInput(mobiusInput, 0, mobiusResult);
  mobiusResult.textContent = "Ready to calculate.";
  clearTelemetry(mobiusResult);
}

function clearNextPrime() {
  nextPrimeInput.value = "100";
  validatePrimeInput(nextPrimeInput, 0, nextPrimeResult);
  nextPrimeResult.textContent = "Ready to calculate.";
  clearTelemetry(nextPrimeResult);
}

function clearPrimeGap() {
  primeGapInput.value = "1000";
  validatePrimeInput(primeGapInput, 3, primeGapResult);
  primeGapResult.textContent = "Ready to calculate.";
  clearTelemetry(primeGapResult);
}

function clearPrimePi() {
  primePiInput.value = "1000";
  validatePrimeInput(primePiInput, 0, primePiResult);
  primePiResult.textContent = "Ready to calculate.";
  clearTelemetry(primePiResult);
}

async function refreshCryptoHealth() {
  cryptoHealthBadge.textContent = "Checking";
  cryptoHealthBadge.className = "status-badge status-badge--idle";
  cryptoHealthMessage.textContent = "Contacting the API...";
  setBusy(refreshCryptoHealthButton, true, "Checking");

  try {
    const data = await fetchCryptoJson("/health");
    cryptoHealthBadge.textContent = data?.ok ? "Online" : "Unknown";
    cryptoHealthBadge.className = data?.ok
      ? "status-badge status-badge--ok"
      : "status-badge status-badge--idle";
    cryptoHealthMessage.textContent = data?.service
      ? `${data.service} responded successfully.`
      : "The service responded successfully.";
  } catch (error) {
    cryptoHealthBadge.textContent = "Offline";
    cryptoHealthBadge.className = "status-badge status-badge--error";
    cryptoHealthMessage.textContent = error.message;
  } finally {
    setBusy(refreshCryptoHealthButton, false, "Checking");
  }
}

function syncHmacForm() {
  const verifying = hmacOperation.value === "verify";
  hmacMacLabel.hidden = !verifying;
  hmacMac.hidden = !verifying;
  hmacMac.required = verifying;
  hmacForm.querySelector("button").textContent = verifying
    ? "Verify HMAC"
    : "Generate HMAC";
}

async function runHmac(event) {
  event.preventDefault();
  const button = hmacForm.querySelector("button");
  const username = hmacUsername.value.trim();
  const password = hmacPassword.value;
  const verifying = hmacOperation.value === "verify";
  const payload = {
    algorithm: hmacAlgorithm.value,
    key: hmacKey.value,
    data: hmacData.value,
  };

  if (verifying) {
    payload.mac = hmacMac.value;
  }

  hmacResult.textContent = verifying ? "Verifying..." : "Generating...";
  setBusy(button, true, verifying ? "Verifying" : "Generating");

  try {
    const data = await fetchCryptoJson(
      verifying ? "/v1/hmac/verify" : "/v1/hmac",
      operationOptions(username, password, payload),
      hmacResult,
      { authUser: username, body: payload },
    );
    hmacResult.textContent = verifying
      ? data.valid
        ? "Valid MAC"
        : "Invalid MAC"
      : data.mac;
  } catch (error) {
    hmacResult.textContent = error.message;
  } finally {
    hmacKey.value = "";
    hmacPassword.value = "";
    setBusy(button, false, verifying ? "Verifying" : "Generating");
  }
}

function clearHmac() {
  hmacOperation.value = "generate";
  hmacAlgorithm.value = "sha256";
  hmacKey.value = "";
  hmacData.value = "message";
  hmacMac.value = "";
  hmacUsername.value = "";
  hmacPassword.value = "";
  hmacResult.textContent = "Your MAC result will appear here.";
  clearTelemetry(hmacResult);
  syncHmacForm();
}

async function refreshHealth() {
  healthBadge.textContent = "Checking";
  healthBadge.className = "status-badge status-badge--idle";
  healthMessage.textContent = "Contacting the API...";
  setBusy(refreshHealthButton, true, "Checking");

  try {
    const data = await fetchJson("/health");
    healthBadge.textContent = data?.ok ? "Online" : "Unknown";
    healthBadge.className = data?.ok
      ? "status-badge status-badge--ok"
      : "status-badge status-badge--idle";
    healthMessage.textContent = data?.service
      ? `${data.service} responded successfully.`
      : "The service responded successfully.";
  } catch (error) {
    healthBadge.textContent = "Offline";
    healthBadge.className = "status-badge status-badge--error";
    healthMessage.textContent = error.message;
  } finally {
    setBusy(refreshHealthButton, false, "Checking");
  }
}

async function lookupCatalan(event) {
  event.preventDefault();

  const n = Number(catalanInput.value);
  if (!Number.isInteger(n) || n < 0 || n > 34) {
    catalanResult.textContent = "Enter an integer from 0 to 34.";
    return;
  }

  const button = catalanForm.querySelector("button");
  catalanResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");

  try {
    const data = await fetchJson(`/v1/math/catalan/${n}`, {}, catalanResult);
    catalanResult.innerHTML = `C<sub>${data.n}</sub> = <strong>${data.value}</strong>`;
  } catch (error) {
    catalanResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

function renderInfo(data) {
  const fields = [
    ["Service", data.service],
    ["API", data.api ?? data.api_version],
    ["Version", data.version ?? data.app_version],
    ["Build profile", data.build_profile],
    ["Environment", data.environment],
    ["Endpoints", Array.isArray(data.endpoints) ? data.endpoints.join(", ") : data.endpoints],
  ];

  infoOutput.replaceChildren(...fields.map(([label, value]) => {
    const row = document.createElement("div");
    const name = document.createElement("dt");
    const result = document.createElement("dd");
    name.textContent = label;
    result.textContent = value ?? "Not provided";
    row.append(name, result);
    return row;
  }));
}

function renderCryptoInfo(data) {
  const fields = [
    ["Service", data.service],
    ["API", data.api],
    ["Version", data.version],
    ["Build profile", data.build_profile],
    ["Environment", data.environment],
    ["Endpoints", Array.isArray(data.endpoints) ? data.endpoints.join(", ") : data.endpoints],
  ];

  cryptoInfoOutput.replaceChildren(...fields.map(([label, value]) => {
    const row = document.createElement("div");
    const name = document.createElement("dt");
    const result = document.createElement("dd");
    name.textContent = label;
    result.textContent = value ?? "Not provided";
    row.append(name, result);
    return row;
  }));
}

async function refreshInfo() {
  infoOutput.replaceChildren();
  const statusRow = document.createElement("div");
  const statusName = document.createElement("dt");
  const statusValue = document.createElement("dd");
  statusName.textContent = "Status";
  statusValue.textContent = "Contacting the API...";
  statusRow.append(statusName, statusValue);
  infoOutput.append(statusRow);
  setBusy(refreshInfoButton, true, "Loading");

  try {
    renderInfo(await fetchJson("/v1/info"));
  } catch (error) {
    infoOutput.replaceChildren();
    const row = document.createElement("div");
    const name = document.createElement("dt");
    const result = document.createElement("dd");
    name.textContent = "Status";
    result.textContent = error.message;
    row.append(name, result);
    infoOutput.append(row);
  } finally {
    setBusy(refreshInfoButton, false, "Loading");
  }
}

async function refreshCryptoInfo() {
  cryptoInfoOutput.replaceChildren();
  const statusRow = document.createElement("div");
  const statusName = document.createElement("dt");
  const statusValue = document.createElement("dd");
  statusName.textContent = "Status";
  statusValue.textContent = "Contacting the API...";
  statusRow.append(statusName, statusValue);
  cryptoInfoOutput.append(statusRow);
  setBusy(refreshCryptoInfoButton, true, "Loading");

  try {
    renderCryptoInfo(await fetchCryptoJson("/v1/info"));
  } catch (error) {
    cryptoInfoOutput.replaceChildren();
    const row = document.createElement("div");
    const name = document.createElement("dt");
    const result = document.createElement("dd");
    name.textContent = "Status";
    result.textContent = error.message;
    row.append(name, result);
    cryptoInfoOutput.append(row);
  } finally {
    setBusy(refreshCryptoInfoButton, false, "Loading");
  }
}

async function loadSnapshot(event) {
  event.preventDefault();

  const username = snapshotUsername.value.trim();
  const password = snapshotPassword.value;

  if (!username || !password) {
    snapshotOutput.textContent = "Enter both username and password.";
    return;
  }

  const button = snapshotForm.querySelector("button[type='submit']");
  snapshotOutput.textContent = "Loading snapshot...";
  setBusy(button, true, "Loading");

  try {
    const data = await fetchJson("/v1/snapshot", {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    snapshotOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    snapshotOutput.textContent = error.message;
  } finally {
    snapshotPassword.value = "";
    setBusy(button, false, "Loading");
  }
}

function clearSnapshot() {
  snapshotUsername.value = "";
  snapshotPassword.value = "";
  snapshotOutput.textContent =
    "Credentials are sent only with this request and are not stored by this page.";
}

function initLorenzSimulation() {
  const canvas = document.querySelector("#lorenz-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const toggleButton = document.querySelector("#lorenz-toggle-btn");
  const resetButton = document.querySelector("#lorenz-reset-btn");
  const stepCounter = document.querySelector("#lorenz-step-counter");
  if (!context || !toggleButton || !resetButton || !stepCounter) return;

  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const dt = 0.008;
  const stepsPerFrame = 7;
  let x = 0.1;
  let y = 0;
  let z = 0;
  let running = true;
  let totalSteps = 0;
  let yaw = 0.4;
  let pitch = -0.3;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  function derivatives(cx, cy, cz) {
    return [
      sigma * (cy - cx),
      cx * (rho - cz) - cy,
      cx * cy - beta * cz,
    ];
  }

  function step() {
    const [dx1, dy1, dz1] = derivatives(x, y, z);
    const [dx2, dy2, dz2] = derivatives(
      x + 0.5 * dt * dx1,
      y + 0.5 * dt * dy1,
      z + 0.5 * dt * dz1,
    );
    const [dx3, dy3, dz3] = derivatives(
      x + 0.5 * dt * dx2,
      y + 0.5 * dt * dy2,
      z + 0.5 * dt * dz2,
    );
    const [dx4, dy4, dz4] = derivatives(
      x + dt * dx3,
      y + dt * dy3,
      z + dt * dz3,
    );
    x += (dt / 6) * (dx1 + 2 * dx2 + 2 * dx3 + dx4);
    y += (dt / 6) * (dy1 + 2 * dy2 + 2 * dy3 + dy4);
    z += (dt / 6) * (dz1 + 2 * dz2 + 2 * dz3 + dz4);
  }

  function project(cx, cy, cz) {
    const centeredZ = cz - 25;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const rotatedX = cx * cosYaw - centeredZ * sinYaw;
    const rotatedZ = cx * sinYaw + centeredZ * cosYaw;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const rotatedY = cy * cosPitch - rotatedZ * sinPitch;
    const depth = cy * sinPitch + rotatedZ * cosPitch;
    const perspective = 380 / (95 + depth);

    return [
      canvas.width / 2 + rotatedX * perspective * 2.2,
      canvas.height / 2 + rotatedY * perspective * 2.2,
    ];
  }

  function reset() {
    x = 0.1;
    y = 0;
    z = 0;
    totalSteps = 0;
    context.fillStyle = "#0a0a0c";
    context.fillRect(0, 0, canvas.width, canvas.height);
    stepCounter.textContent = "Steps: 0";
  }

  function clearTrail(amount = 0.04) {
    context.fillStyle = `rgba(10, 10, 12, ${amount})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function render() {
    if (!running) return;
    if (!dragging) yaw += 0.0015;
    clearTrail();

    for (let index = 0; index < stepsPerFrame; index += 1) {
      const [previousX, previousY] = project(x, y, z);
      step();
      const [nextX, nextY] = project(x, y, z);
      totalSteps += 1;
      context.strokeStyle = `hsla(${140 + Math.min(100, Math.floor(z * 2.2))}, 85%, 60%, 0.85)`;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(previousX, previousY);
      context.lineTo(nextX, nextY);
      context.stroke();
    }

    if (totalSteps % 30 === 0) {
      stepCounter.textContent = `Steps: ${totalSteps.toLocaleString()}`;
    }
    requestAnimationFrame(render);
  }

  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    yaw += deltaX * 0.01;
    pitch = Math.max(-1.4, Math.min(1.4, pitch + deltaY * 0.01));
    clearTrail(0.15);
  });

  function stopDragging(event) {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = "grab";
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);

  toggleButton.addEventListener("click", () => {
    running = !running;
    toggleButton.textContent = running ? "Pause" : "Resume";
    if (running) render();
  });
  resetButton.addEventListener("click", reset);
  reset();
  render();
}

refreshHealthButton.addEventListener("click", refreshHealth);
refreshCryptoHealthButton.addEventListener("click", refreshCryptoHealth);
refreshInfoButton.addEventListener("click", refreshInfo);
refreshCryptoInfoButton.addEventListener("click", refreshCryptoInfo);
catalanForm.addEventListener("submit", lookupCatalan);
catalanInput.addEventListener("input", validateCatalanInput);
clearCatalanButton.addEventListener("click", clearCatalan);
fibonacciForm.addEventListener("submit", lookupFibonacci);
fibonacciInput.addEventListener("input", validateFibonacciInput);
clearFibonacciButton.addEventListener("click", clearFibonacci);
gcdForm.addEventListener("submit", lookupGcd);
gcdAInput.addEventListener("input", validateGcdInputs);
gcdBInput.addEventListener("input", validateGcdInputs);
clearGcdButton.addEventListener("click", clearGcd);
primeForm.addEventListener("submit", lookupPrime);
primeInput.addEventListener("input", () => validatePrimeInput(primeInput, 0, primeResult));
clearPrimeButton.addEventListener("click", clearPrime);
nextPrimeForm.addEventListener("submit", lookupNextPrime);
nextPrimeInput.addEventListener("input", () => validatePrimeInput(nextPrimeInput, 0, nextPrimeResult));
clearNextPrimeButton.addEventListener("click", clearNextPrime);
primeGapForm.addEventListener("submit", lookupPrimeGap);
primeGapInput.addEventListener("input", () => validatePrimeInput(primeGapInput, 3, primeGapResult));
clearPrimeGapButton.addEventListener("click", clearPrimeGap);
primePiForm.addEventListener("submit", lookupPrimePi);
primePiInput.addEventListener("input", () => validatePrimeInput(primePiInput, 0, primePiResult));
clearPrimePiButton.addEventListener("click", clearPrimePi);
factorForm.addEventListener("submit", lookupFactor);
factorInput.addEventListener("input", () => validatePrimeInput(factorInput, 0, factorResult));
clearFactorButton.addEventListener("click", clearFactor);
totientForm.addEventListener("submit", lookupTotient);
totientInput.addEventListener("input", () => validatePrimeInput(totientInput, 0, totientResult));
clearTotientButton.addEventListener("click", clearTotient);
mobiusForm.addEventListener("submit", lookupMobius);
mobiusInput.addEventListener("input", () => validatePrimeInput(mobiusInput, 0, mobiusResult));
clearMobiusButton.addEventListener("click", clearMobius);
snapshotForm.addEventListener("submit", loadSnapshot);
clearSnapshotButton.addEventListener("click", clearSnapshot);
hashForm.addEventListener("submit", runHash);
clearHashButton.addEventListener("click", clearHash);
hmacForm.addEventListener("submit", runHmac);
clearHmacButton.addEventListener("click", clearHmac);
hmacOperation.addEventListener("change", syncHmacForm);

initLorenzSimulation();
initStegoInspector();
refreshHealth();
refreshInfo();
refreshCryptoHealth();
refreshCryptoInfo();
syncHmacForm();
validateCatalanInput();
validateFibonacciInput();
validateGcdInputs();
validatePrimeInput(primeInput, 0, primeResult);
validatePrimeInput(nextPrimeInput, 0, nextPrimeResult);
validatePrimeInput(primeGapInput, 3, primeGapResult);
validatePrimeInput(primePiInput, 0, primePiResult);
validatePrimeInput(factorInput, 0, factorResult);
validatePrimeInput(totientInput, 0, totientResult);
validatePrimeInput(mobiusInput, 0, mobiusResult);
