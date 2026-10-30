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
const previousPrimeForm = document.querySelector("#previous-prime-form");
const previousPrimeInput = document.querySelector("#previous-prime-n");
const previousPrimeResult = document.querySelector("#previous-prime-result");
const clearPreviousPrimeButton = document.querySelector("#clear-previous-prime");
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
const divisorCountForm = document.querySelector("#divisor-count-form");
const divisorCountInput = document.querySelector("#divisor-count-n");
const divisorCountResult = document.querySelector("#divisor-count-result");
const clearDivisorCountButton = document.querySelector("#clear-divisor-count");
const divisorSumForm = document.querySelector("#divisor-sum-form");
const divisorSumInput = document.querySelector("#divisor-sum-n");
const divisorSumResult = document.querySelector("#divisor-sum-result");
const clearDivisorSumButton = document.querySelector("#clear-divisor-sum");
const divisorsForm = document.querySelector("#divisors-form");
const divisorsInput = document.querySelector("#divisors-n");
const divisorsResult = document.querySelector("#divisors-result");
const clearDivisorsButton = document.querySelector("#clear-divisors");
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

const sqrtmodForm = document.querySelector("#sqrtmod-form");
const sqrtmodA = document.querySelector("#sqrtmod-a");
const sqrtmodP = document.querySelector("#sqrtmod-p");
const sqrtmodResult = document.querySelector("#sqrtmod-result");
const clearSqrtmodButton = document.querySelector("#clear-sqrtmod");

const legendreForm = document.querySelector("#legendre-form");
const legendreA = document.querySelector("#legendre-a");
const legendreP = document.querySelector("#legendre-p");
const legendreResult = document.querySelector("#legendre-result");
const clearLegendreButton = document.querySelector("#clear-legendre");

const ecmulForm = document.querySelector("#ecmul-form");
const ecmulCurve = document.querySelector("#ecmul-curve");
const ecmulK = document.querySelector("#ecmul-k");
const ecmulResult = document.querySelector("#ecmul-result");
const clearEcmulButton = document.querySelector("#clear-ecmul");

const crtForm = document.querySelector("#crt-form");
const crtRemainders = document.querySelector("#crt-remainders");
const crtModuli = document.querySelector("#crt-moduli");
const crtResult = document.querySelector("#crt-result");
const clearCrtButton = document.querySelector("#clear-crt");

const cryptoFactorForm = document.querySelector("#crypto-factor-form");
const cryptoFactorN = document.querySelector("#crypto-factor-n");
const cryptoFactorResult = document.querySelector("#crypto-factor-result");
const clearCryptoFactorButton = document.querySelector("#clear-crypto-factor");

const cryptoFermatForm = document.querySelector("#crypto-fermat-form");
const cryptoFermatN = document.querySelector("#crypto-fermat-n");
const cryptoFermatResult = document.querySelector("#crypto-fermat-result");
const clearCryptoFermatButton = document.querySelector("#clear-crypto-fermat");

const cryptoMersenneForm = document.querySelector("#crypto-mersenne-form");
const cryptoMersenneAction = document.querySelector("#crypto-mersenne-action");
const cryptoMersenneTestGroup = document.querySelector("#crypto-mersenne-test-group");
const cryptoMersenneSeqGroup = document.querySelector("#crypto-mersenne-seq-group");
const cryptoMersenneP = document.querySelector("#crypto-mersenne-p");
const cryptoMersenneLimit = document.querySelector("#crypto-mersenne-limit");
const submitCryptoMersenne = document.querySelector("#submit-crypto-mersenne");
const cryptoMersenneResult = document.querySelector("#crypto-mersenne-result");
const clearCryptoMersenneButton = document.querySelector("#clear-crypto-mersenne");

const cryptoPerfectForm = document.querySelector("#crypto-perfect-form");
const cryptoPerfectN = document.querySelector("#crypto-perfect-n");
const cryptoPerfectP = document.querySelector("#crypto-perfect-p");
const cryptoPerfectResult = document.querySelector("#crypto-perfect-result");
const clearCryptoPerfectButton = document.querySelector("#clear-crypto-perfect");

const cryptoPm1Form = document.querySelector("#crypto-pm1-form");
const cryptoPm1N = document.querySelector("#crypto-pm1-n");
const cryptoPm1B1 = document.querySelector("#crypto-pm1-b1");
const cryptoPm1B2 = document.querySelector("#crypto-pm1-b2");
const cryptoPm1Result = document.querySelector("#crypto-pm1-result");
const clearCryptoPm1Button = document.querySelector("#clear-crypto-pm1");

const cryptoTotientForm = document.querySelector("#crypto-totient-form");
const cryptoTotientN = document.querySelector("#crypto-totient-n");
const cryptoTotientResult = document.querySelector("#crypto-totient-result");
const clearCryptoTotientButton = document.querySelector("#clear-crypto-totient");

const cryptoOrderForm = document.querySelector("#crypto-order-form");
const cryptoOrderA = document.querySelector("#crypto-order-a");
const cryptoOrderM = document.querySelector("#crypto-order-m");
const cryptoOrderResult = document.querySelector("#crypto-order-result");
const clearCryptoOrderButton = document.querySelector("#clear-crypto-order");

const cryptoDlogForm = document.querySelector("#crypto-dlog-form");
const cryptoDlogG = document.querySelector("#crypto-dlog-g");
const cryptoDlogH = document.querySelector("#crypto-dlog-h");
const cryptoDlogP = document.querySelector("#crypto-dlog-p");
const cryptoDlogResult = document.querySelector("#crypto-dlog-result");
const clearCryptoDlogButton = document.querySelector("#clear-crypto-dlog");

const cryptoArithForm = document.querySelector("#crypto-arith-form");
const cryptoArithN = document.querySelector("#crypto-arith-n");
const cryptoArithK = document.querySelector("#crypto-arith-k");
const cryptoArithResult = document.querySelector("#crypto-arith-result");
const clearCryptoArithButton = document.querySelector("#clear-crypto-arith");

const cryptoJacobiForm = document.querySelector("#crypto-jacobi-form");
const cryptoJacobiA = document.querySelector("#crypto-jacobi-a");
const cryptoJacobiN = document.querySelector("#crypto-jacobi-n");
const cryptoJacobiResult = document.querySelector("#crypto-jacobi-result");
const clearCryptoJacobiButton = document.querySelector("#clear-crypto-jacobi");

const cryptoSolovayForm = document.querySelector("#crypto-solovay-form");
const cryptoSolovayN = document.querySelector("#crypto-solovay-n");
const cryptoSolovayRounds = document.querySelector("#crypto-solovay-rounds");
const cryptoSolovayResult = document.querySelector("#crypto-solovay-result");
const clearCryptoSolovayButton = document.querySelector("#clear-crypto-solovay");

const cryptoRsaForm = document.querySelector("#crypto-rsa-form");
const cryptoRsaAction = document.querySelector("#crypto-rsa-action");
const cryptoRsaKeygenGroup = document.querySelector("#crypto-rsa-keygen-group");
const cryptoRsaEncryptGroup = document.querySelector("#crypto-rsa-encrypt-group");
const cryptoRsaDecryptGroup = document.querySelector("#crypto-rsa-decrypt-group");
const cryptoRsaCrackGroup = document.querySelector("#crypto-rsa-crack-group");
const cryptoRsaBits = document.querySelector("#crypto-rsa-bits");
const cryptoRsaEGen = document.querySelector("#crypto-rsa-e-gen");
const cryptoRsaM = document.querySelector("#crypto-rsa-m");
const cryptoRsaEncE = document.querySelector("#crypto-rsa-enc-e");
const cryptoRsaEncN = document.querySelector("#crypto-rsa-enc-n");
const cryptoRsaC = document.querySelector("#crypto-rsa-c");
const cryptoRsaD = document.querySelector("#crypto-rsa-d");
const cryptoRsaDecN = document.querySelector("#crypto-rsa-dec-n");
const cryptoRsaP = document.querySelector("#crypto-rsa-p");
const cryptoRsaQ = document.querySelector("#crypto-rsa-q");
const cryptoRsaCrackN = document.querySelector("#crypto-rsa-crack-n");
const cryptoRsaCrackE = document.querySelector("#crypto-rsa-crack-e");
const cryptoRsaCrackC = document.querySelector("#crypto-rsa-crack-c");
const submitCryptoRsa = document.querySelector("#submit-crypto-rsa");
const clearCryptoRsaButton = document.querySelector("#clear-crypto-rsa");
const cryptoRsaResult = document.querySelector("#crypto-rsa-result");

const cryptoDhForm = document.querySelector("#crypto-dh-form");
const cryptoDhAction = document.querySelector("#crypto-dh-action");
const cryptoDhKeygenGroup = document.querySelector("#crypto-dh-keygen-group");
const cryptoDhDeriveGroup = document.querySelector("#crypto-dh-derive-group");
const cryptoDhCrackGroup = document.querySelector("#crypto-dh-crack-group");
const cryptoDhP = document.querySelector("#crypto-dh-p");
const cryptoDhG = document.querySelector("#crypto-dh-g");
const cryptoDhPriv = document.querySelector("#crypto-dh-priv");
const cryptoDhDerivePriv = document.querySelector("#crypto-dh-derive-priv");
const cryptoDhDerivePub = document.querySelector("#crypto-dh-derive-pub");
const cryptoDhDeriveP = document.querySelector("#crypto-dh-derive-p");
const cryptoDhCrackG = document.querySelector("#crypto-dh-crack-g");
const cryptoDhCrackPub = document.querySelector("#crypto-dh-crack-pub");
const cryptoDhCrackP = document.querySelector("#crypto-dh-crack-p");
const submitCryptoDh = document.querySelector("#submit-crypto-dh");
const clearCryptoDhButton = document.querySelector("#clear-crypto-dh");
const cryptoDhResult = document.querySelector("#crypto-dh-result");

const challengeForm = document.querySelector("#challenge-form");
const challengeTopic = document.querySelector("#challenge-topic");
const challengeSeed = document.querySelector("#challenge-seed");
const challengeResult = document.querySelector("#challenge-result");
const clearChallengeButton = document.querySelector("#clear-challenge");

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
      // Prevent IEEE 754 precision loss on integers >= 2^53 (e.g. 62-bit RSA moduli)
      // Matches quoted strings to leave them intact, and quotes any 15+ digit raw numbers
      const safeText = text.replace(
        /"(?:\\.|[^"\\])*"|(-?\b\d{15,}\b)/g,
        (match, num) => (num ? `"${num}"` : match),
      );
      body = JSON.parse(safeText);
    } catch {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
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

async function lookupPreviousPrime(event) {
  event.preventDefault();
  const n = primeInputValue(previousPrimeInput, previousPrimeResult, 3);
  if (n === null) return;
  const button = previousPrimeForm.querySelector("button[type='submit']");
  previousPrimeResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchJson(`/v1/math/previous-prime/${n}`, {}, previousPrimeResult);
    previousPrimeResult.innerHTML = `Previous prime before ${data.n} = <strong>${data.value}</strong>`;
  } catch (error) {
    previousPrimeResult.textContent = error.message;
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

async function lookupDivisorCount(event) {
  event.preventDefault();
  const n = primeInputValue(divisorCountInput, divisorCountResult, 0);
  if (n === null) return;
  const button = divisorCountForm.querySelector("button[type='submit']");
  divisorCountResult.textContent = "Counting...";
  setBusy(button, true, "Counting");
  try {
    const data = await fetchJson(`/v1/math/divisor-count/${n}`, {}, divisorCountResult);
    divisorCountResult.textContent = `τ(${data.n}) = ${data.value}`;
  } catch (error) {
    divisorCountResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Counting");
  }
}

async function lookupDivisorSum(event) {
  event.preventDefault();
  const n = primeInputValue(divisorSumInput, divisorSumResult, 0);
  if (n === null) return;
  const button = divisorSumForm.querySelector("button[type='submit']");
  divisorSumResult.textContent = "Summing...";
  setBusy(button, true, "Summing");
  try {
    const data = await fetchJson(`/v1/math/divisor-sum/${n}`, {}, divisorSumResult);
    divisorSumResult.textContent = `σ(${data.n}) = ${data.value}`;
  } catch (error) {
    divisorSumResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Summing");
  }
}

async function lookupDivisors(event) {
  event.preventDefault();
  const n = primeInputValue(divisorsInput, divisorsResult, 0);
  if (n === null) return;
  const button = divisorsForm.querySelector("button[type='submit']");
  divisorsResult.textContent = "Listing...";
  setBusy(button, true, "Listing");
  try {
    const data = await fetchJson(`/v1/math/divisors/${n}`, {}, divisorsResult);
    divisorsResult.textContent = data.divisors.join(", ");
  } catch (error) {
    divisorsResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Listing");
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

function clearDivisorCount() {
  divisorCountInput.value = "360";
  validatePrimeInput(divisorCountInput, 0, divisorCountResult);
  divisorCountResult.textContent = "Ready to calculate.";
  clearTelemetry(divisorCountResult);
}

function clearDivisorSum() {
  divisorSumInput.value = "360";
  validatePrimeInput(divisorSumInput, 0, divisorSumResult);
  divisorSumResult.textContent = "Ready to calculate.";
  clearTelemetry(divisorSumResult);
}

function clearDivisors() {
  divisorsInput.value = "12";
  validatePrimeInput(divisorsInput, 0, divisorsResult);
  divisorsResult.textContent = "Ready to list divisors.";
  clearTelemetry(divisorsResult);
}

function clearNextPrime() {
  nextPrimeInput.value = "100";
  validatePrimeInput(nextPrimeInput, 0, nextPrimeResult);
  nextPrimeResult.textContent = "Ready to calculate.";
  clearTelemetry(nextPrimeResult);
}

function clearPreviousPrime() {
  previousPrimeInput.value = "100";
  validatePrimeInput(previousPrimeInput, 3, previousPrimeResult);
  previousPrimeResult.textContent = "Ready to calculate.";
  clearTelemetry(previousPrimeResult);
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

function initLabFilters() {
  const filterButtons = document.querySelectorAll(".lab-filter-btn");
  const cards = document.querySelectorAll("[data-lab-category]");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetCategory = button.dataset.category;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("lab-button--secondary", !isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const categories = (card.dataset.labCategory || "").split(/\s+/);
        card.hidden =
          targetCategory !== "all" &&
          !categories.includes(targetCategory);
      });
    });
  });
}

async function runSqrtmod(event) {
  event.preventDefault();
  const a = Number(sqrtmodA.value);
  const p = Number(sqrtmodP.value);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(p) || p < 3 || p % 2 === 0) {
    sqrtmodResult.textContent = "Enter integer a and an odd prime modulus p ≥ 3.";
    return;
  }
  const button = sqrtmodForm.querySelector("button[type='submit']");
  sqrtmodResult.textContent = "Calculating roots...";
  setBusy(button, true, "Calculating");
  try {
    const data = await fetchCryptoJson(`/v1/math/sqrtmod?a=${encodeURIComponent(a)}&p=${encodeURIComponent(p)}`, {}, sqrtmodResult);
    if (!data.roots || data.roots.length === 0) {
      sqrtmodResult.innerHTML = `No roots exist for ${data.a} mod ${data.p} (quadratic non-residue).`;
    } else {
      sqrtmodResult.innerHTML = `&radic;${data.a} mod ${data.p} = <strong>[&plusmn;${data.roots.join(", ")}]</strong>`;
    }
  } catch (error) {
    sqrtmodResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

function clearSqrtmod() {
  sqrtmodA.value = "10";
  sqrtmodP.value = "13";
  sqrtmodResult.textContent = "Enter a and odd prime p.";
  clearTelemetry(sqrtmodResult);
}

async function runLegendre(event) {
  event.preventDefault();
  const a = Number(legendreA.value);
  const p = Number(legendreP.value);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(p) || p < 3 || p % 2 === 0) {
    legendreResult.textContent = "Enter integer a and an odd prime modulus p ≥ 3.";
    return;
  }
  const button = legendreForm.querySelector("button[type='submit']");
  legendreResult.textContent = "Computing (a/p)...";
  setBusy(button, true, "Computing");
  try {
    const data = await fetchCryptoJson(`/v1/math/legendre?a=${encodeURIComponent(a)}&p=${encodeURIComponent(p)}`, {}, legendreResult);
    const desc = data.value === 1 ? "Quadratic residue" : data.value === -1 ? "Quadratic non-residue" : "Multiple of p";
    legendreResult.innerHTML = `(${data.a}/${data.p}) = <strong>${data.value}</strong> (${desc})`;
  } catch (error) {
    legendreResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Computing");
  }
}

function clearLegendre() {
  legendreA.value = "10";
  legendreP.value = "13";
  legendreResult.textContent = "Enter a and odd prime p.";
  clearTelemetry(legendreResult);
}

async function runEcmul(event) {
  event.preventDefault();
  const curve = ecmulCurve.value;
  const k = Number(ecmulK.value);
  if (!Number.isSafeInteger(k) || k < 0) {
    ecmulResult.textContent = "Scalar multiplier k must be a non-negative integer.";
    return;
  }
  const button = ecmulForm.querySelector("button[type='submit']");
  ecmulResult.textContent = "Multiplying k · G...";
  setBusy(button, true, "Multiplying");
  try {
    const data = await fetchCryptoJson("/v1/math/ecmul", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curve, k }),
    }, ecmulResult);
    const ptStr = data.result ? `(${data.result[0]}, ${data.result[1]})` : "&infin; (Point at Infinity)";
    ecmulResult.innerHTML = `${data.k} &middot; G = <strong>${ptStr}</strong> on <em>${data.curve}</em> ${data.result_on_curve ? "(on curve &check;)" : ""}`;
  } catch (error) {
    ecmulResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Multiplying");
  }
}

function clearEcmul() {
  ecmulCurve.value = "toy193";
  ecmulK.value = "7";
  ecmulResult.textContent = "Select curve and scalar k.";
  clearTelemetry(ecmulResult);
}

async function runCrt(event) {
  event.preventDefault();
  const rRaw = crtRemainders.value.split(",").map((s) => Number(s.trim()));
  const mRaw = crtModuli.value.split(",").map((s) => Number(s.trim()));
  if (rRaw.some(isNaN) || mRaw.some(isNaN) || rRaw.length !== mRaw.length || rRaw.length === 0) {
    crtResult.textContent = "Enter equal counts of comma-separated integers for remainders and moduli.";
    return;
  }
  const button = crtForm.querySelector("button[type='submit']");
  crtResult.textContent = "Solving congruences...";
  setBusy(button, true, "Solving");
  try {
    const data = await fetchCryptoJson("/v1/math/crt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remainders: rRaw, moduli: mRaw }),
    }, crtResult);
    crtResult.innerHTML = `Solution: x &equiv; <strong>${data.x}</strong> (mod ${data.modulus})`;
  } catch (error) {
    crtResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Solving");
  }
}

function clearCrt() {
  crtRemainders.value = "2, 3, 2";
  crtModuli.value = "3, 5, 7";
  crtResult.textContent = "Enter comma-separated r and m.";
  clearTelemetry(crtResult);
}

async function runCryptoFactor(event) {
  event.preventDefault();
  const nRaw = cryptoFactorN.value.trim();
  if (!/^[1-9]\d*$/.test(nRaw)) {
    cryptoFactorResult.textContent = "Enter a valid positive integer n ≥ 1.";
    return;
  }
  const button = cryptoFactorForm.querySelector("button[type='submit']");
  cryptoFactorResult.textContent = "Factoring integer...";
  setBusy(button, true, "Factoring");
  try {
    const data = await fetchCryptoJson(`/v1/math/factor?n=${encodeURIComponent(nRaw)}`, {}, cryptoFactorResult);
    const status = data.is_prime ? "Prime" : (data.n === 1 ? "Unit" : "Composite");
    cryptoFactorResult.innerHTML = `<strong>${data.n}</strong> = <code>${data.expression}</code> (${status})`;
  } catch (error) {
    cryptoFactorResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Factoring");
  }
}

function clearCryptoFactor() {
  cryptoFactorN.value = "104729";
  cryptoFactorResult.textContent = "Enter integer n (up to 2⁶³ - 1).";
  clearTelemetry(cryptoFactorResult);
}

async function runCryptoFermat(event) {
  event.preventDefault();
  const nRaw = cryptoFermatN.value.trim();
  let nBig;
  try {
    nBig = BigInt(nRaw);
  } catch {
    cryptoFermatResult.textContent = "Enter a valid integer n ≥ 3.";
    return;
  }
  if (nBig < 3n) {
    cryptoFermatResult.textContent = "Modulus n must be an odd integer ≥ 3.";
    return;
  }
  if (nBig % 2n === 0n) {
    cryptoFermatResult.textContent = "Fermat's method requires an odd composite integer (n is even).";
    return;
  }

  const button = cryptoFermatForm.querySelector("button[type='submit']");
  cryptoFermatResult.textContent = "Factoring via difference of squares...";
  setBusy(button, true, "Factoring");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/fermat?n=${encodeURIComponent(nRaw)}`,
      {},
      cryptoFermatResult
    );
    if (data.found) {
      cryptoFermatResult.innerHTML = `<strong>${data.n.toLocaleString()}</strong> = <code>${data.p.toLocaleString()} × ${data.q.toLocaleString()}</code><br><span class="lab-muted">x = ${data.x.toLocaleString()}, y = ${data.y.toLocaleString()} (x² - y² = ${data.x}² - ${data.y}²), ${data.steps_count} ${data.steps_count === 1 ? "step" : "steps"} in ${data.elapsed_us.toLocaleString()} µs</span>`;
    } else {
      cryptoFermatResult.innerHTML = `<strong>${data.n.toLocaleString()}</strong>: No non-trivial factors found (${data.reason}).<br><span class="lab-muted">Initial x = ${data.initial_x.toLocaleString()}, evaluated ${data.steps_count} ${data.steps_count === 1 ? "step" : "steps"} in ${data.elapsed_us.toLocaleString()} µs</span>`;
    }
  } catch (error) {
    cryptoFermatResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Factoring");
  }
}

function clearCryptoFermat() {
  cryptoFermatN.value = "5959";
  cryptoFermatResult.innerHTML = `Enter an odd composite integer n &ge; 3. For visual step streaming, visit <a href="/chamber.html" style="color: var(--lab-accent); font-weight: 600;">The Chamber of Primes &rsaquo;</a>`;
  clearTelemetry(cryptoFermatResult);
}

function syncMersenneForm() {
  const action = cryptoMersenneAction?.value || "test";
  if (cryptoMersenneTestGroup) cryptoMersenneTestGroup.style.display = action === "test" ? "block" : "none";
  if (cryptoMersenneSeqGroup) cryptoMersenneSeqGroup.style.display = action === "sequence" ? "block" : "none";
  if (submitCryptoMersenne) {
    submitCryptoMersenne.textContent = action === "test" ? "Test via Lucas–Lehmer" : "Enumerate sequence";
  }
}

function renderLucasLehmerTrace(p, isPrime, pIsPrime) {
  if (p === 2) {
    return `<div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 4px; font-size: 0.85rem;">` +
      `<strong>Lucas–Lehmer sequence:</strong><br><code>s₀ = 4 ≡ 1 mod 3</code> (M₂ = 3 is prime by definition).</div>`;
  }
  if (!pIsPrime) {
    return `<div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 4px; font-size: 0.85rem;">` +
      `<span class="lab-muted">Lucas–Lehmer test skipped: exponent p = ${p} is composite (2<sup>${p}</sup> &minus; 1 cannot be prime).</span></div>`;
  }
  if (p > 500) {
    return `<div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 4px; font-size: 0.85rem;">` +
      `<span class="lab-muted">Lucas–Lehmer sequence for p = ${p} evaluated (${p - 2} iterations of s<sub>i</sub> = (s<sub>i-1</sub>² &minus; 2) mod M<sub>${p}</sub>). Final residue s<sub>${p - 2}</sub> ${isPrime ? "≡ 0" : "≠ 0"} mod M<sub>${p}</sub>.</span></div>`;
  }

  const pBig = BigInt(p);
  const mp = (1n << pBig) - 1n;
  let s = 4n;
  const total = p - 2;
  const rows = [];
  rows.push(`<div><code>s₀ = 4</code></div>`);

  for (let i = 1; i <= total; i++) {
    const prev = s;
    s = (s * s - 2n) % mp;
    if (total <= 10 || i <= 4 || i >= total - 1) {
      const badge = (i === total)
        ? (s === 0n ? ` <span style="color: #2ea043; font-weight: bold;">(≡ 0 ✓ PRIME)</span>` : ` <span style="color: #f85149; font-weight: bold;">(≠ 0 ✗ COMPOSITE)</span>`)
        : "";
      const prevStr = prev.toString();
      const prevDisplay = prevStr.length > 25 ? `${prevStr.slice(0, 12)}…${prevStr.slice(-8)}` : prevStr;
      const sStr = s.toString();
      const sDisplay = sStr.length > 35 ? `${sStr.slice(0, 16)}…${sStr.slice(-12)}` : sStr;
      rows.push(`<div><code>s<sub>${i}</sub> = (${prevDisplay}² &minus; 2) mod M<sub>${p}</sub> = <strong>${sDisplay}</strong></code>${badge}</div>`);
    } else if (i === 5) {
      rows.push(`<div style="color: var(--lab-muted); padding: 0.2rem 0;"><em>… (${total - 6} iterations omitted for brevity) …</em></div>`);
    }
  }

  return `<div style="margin-top: 0.65rem; border-top: 1px solid var(--lab-border); padding-top: 0.5rem;">` +
    `<strong style="font-size: 0.85rem;">Lucas–Lehmer Recurrence Trace (s<sub>i</sub> &equiv; s<sub>i&minus;1</sub>&sup2; &minus; 2 mod M<sub>${p}</sub>):</strong>` +
    `<div style="margin-top: 0.35rem; max-height: 200px; overflow-y: auto; font-family: var(--font-mono, monospace); font-size: 0.82rem; line-height: 1.6; background: rgba(0, 0, 0, 0.04); border-radius: 4px; padding: 0.5rem 0.65rem;">` +
    rows.join("") +
    `</div></div>`;
}

async function runCryptoMersenne(event) {
  event?.preventDefault();
  const action = cryptoMersenneAction?.value || "test";
  const button = submitCryptoMersenne || cryptoMersenneForm.querySelector("button[type='submit']");

  if (action === "test") {
    const pRaw = cryptoMersenneP.value.trim();
    const p = parseInt(pRaw, 10);
    if (isNaN(p) || p < 2 || p > 5000) {
      cryptoMersenneResult.textContent = "Please enter an integer exponent p between 2 and 5000.";
      return;
    }

    cryptoMersenneResult.textContent = `Testing Mersenne number M_${p} = 2^${p} - 1 via Lucas–Lehmer test...`;
    setBusy(button, true, "Testing");
    try {
      const data = await fetchCryptoJson(
        `/v1/math/mersenne?p=${encodeURIComponent(p)}`,
        {},
        cryptoMersenneResult
      );
      const traceHtml = renderLucasLehmerTrace(data.p, data.is_prime, data.p_is_prime);
      if (data.is_prime) {
        cryptoMersenneResult.innerHTML = `<strong>M<sub>${data.p}</sub> = 2<sup>${data.p}</sup> &minus; 1 is PRIME!</strong><br>` +
          `<code>${data.mp}</code><br>` +
          `<span class="lab-muted">${data.digits.toLocaleString()} decimal digits (${data.bits} bits).</span><br>` +
          `<span style="color: var(--lab-accent); font-weight: 600;">Euclid–Euler even perfect number 2<sup>${data.p - 1}</sup>(2<sup>${data.p}</sup> &minus; 1):</span><br>` +
          `<code>${data.perfect_number}</code>` +
          traceHtml;
      } else {
        const reason = !data.p_is_prime ? `exponent ${data.p} is composite` : `failed Lucas–Lehmer primality test (s_${data.p - 2} ≠ 0 mod M_${data.p})`;
        cryptoMersenneResult.innerHTML = `<strong>M<sub>${data.p}</sub> = 2<sup>${data.p}</sup> &minus; 1 is COMPOSITE</strong> (${reason}).<br>` +
          `<code>${data.mp}</code><br>` +
          `<span class="lab-muted">${data.digits.toLocaleString()} decimal digits (${data.bits} bits). No even perfect number corresponds to this exponent.</span>` +
          traceHtml;
      }
    } catch (error) {
      cryptoMersenneResult.textContent = error.message;
    } finally {
      setBusy(button, false, "Testing");
    }
  } else {
    // Sequence mode
    const limitRaw = cryptoMersenneLimit?.value.trim() || "127";
    const limit = parseInt(limitRaw, 10);
    if (isNaN(limit) || limit < 2 || limit > 5000) {
      cryptoMersenneResult.textContent = "Please enter an upper bound limit between 2 and 5000.";
      return;
    }

    cryptoMersenneResult.textContent = `Finding Mersenne prime exponents for p ≤ ${limit}...`;
    setBusy(button, true, "Enumerating");
    try {
      const data = await fetchCryptoJson(
        `/v1/math/mersenne?limit=${encodeURIComponent(limit)}`,
        {},
        cryptoMersenneResult
      );
      const primes = data.primes || [];
      let html = `<strong>Found ${primes.length} Mersenne prime ${primes.length === 1 ? "exponent" : "exponents"} for <em>p</em> &le; ${data.limit}:</strong><br>`;
      html += `<div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.4rem;">`;
      primes.forEach(p => {
        html += `<button type="button" class="lab-button lab-button--secondary lab-button--compact mersenne-chip" data-p="${p}" title="Click to test M_${p}" style="font-weight: 600; padding: 0.2rem 0.5rem; cursor: pointer;">p = ${p}</button>`;
      });
      html += `</div>`;
      html += `<p class="lab-muted" style="margin-top: 0.5rem; font-size: 0.85rem;">Click any exponent pill to inspect its full decimal expansion and Euclid–Euler perfect number.</p>`;
      cryptoMersenneResult.innerHTML = html;

      // Attach click listeners to chips to switch to test mode and run test immediately
      cryptoMersenneResult.querySelectorAll(".mersenne-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const pVal = chip.getAttribute("data-p");
          if (cryptoMersenneAction) cryptoMersenneAction.value = "test";
          syncMersenneForm();
          if (cryptoMersenneP) cryptoMersenneP.value = pVal;
          runCryptoMersenne();
        });
      });
    } catch (error) {
      cryptoMersenneResult.textContent = error.message;
    } finally {
      setBusy(button, false, "Enumerating");
    }
  }
}

function clearCryptoMersenne() {
  if (cryptoMersenneAction) cryptoMersenneAction.value = "test";
  syncMersenneForm();
  if (cryptoMersenneP) cryptoMersenneP.value = "31";
  if (cryptoMersenneLimit) cryptoMersenneLimit.value = "127";
  cryptoMersenneResult.textContent = "Select an operation and configure parameters.";
  clearTelemetry(cryptoMersenneResult);
}

async function runCryptoPerfect(event) {
  event.preventDefault();
  const nRaw = cryptoPerfectN.value.trim();
  const pRaw = cryptoPerfectP.value.trim();

  if (!nRaw && !pRaw) {
    cryptoPerfectResult.textContent = "Please enter either an integer n (to test if n is perfect) or prime exponent p (to generate a perfect number).";
    return;
  }

  const queryParams = new URLSearchParams();
  if (nRaw) queryParams.set("n", nRaw);
  if (pRaw) queryParams.set("p", pRaw);

  const button = cryptoPerfectForm.querySelector("button[type='submit']");
  cryptoPerfectResult.textContent = "Evaluating perfect number properties...";
  setBusy(button, true, "Evaluating");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/perfect?${queryParams.toString()}`,
      {},
      cryptoPerfectResult
    );
    let html = "";
    if (data.n !== undefined && data.n !== null) {
      const isPerf = data.is_perfect;
      const sigmaVal = data.sigma;
      html += `<strong>n = ${data.n.toLocaleString()}</strong>: ${isPerf ? '<span style="color:#2ea043; font-weight:bold;">PERFECT NUMBER</span>' : '<span style="color:#f85149; font-weight:bold;">NOT PERFECT</span>'}<br>` +
        `<span class="lab-muted">Sum of all divisors &sigma;(${data.n}) = ${sigmaVal !== undefined ? sigmaVal.toLocaleString() : "N/A"} (target: 2n = ${(2 * data.n).toLocaleString()})</span><br>`;
    }
    if (data.p !== undefined && data.p !== null) {
      if (html) html += "<hr style='margin:0.5rem 0; border:0; border-top:1px solid var(--lab-border);'>";
      html += `<strong>Even perfect number for exponent p = ${data.p}:</strong><br>` +
        `<code>${data.perfect_number}</code>`;
    }
    cryptoPerfectResult.innerHTML = html;
  } catch (error) {
    cryptoPerfectResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Evaluating");
  }
}

function clearCryptoPerfect() {
  cryptoPerfectN.value = "";
  cryptoPerfectP.value = "";
  cryptoPerfectResult.innerHTML = "Enter n to test if &sigma;(n) = 2n, or p to generate 2<sup>p&minus;1</sup>(2<sup>p</sup> &minus; 1).";
  clearTelemetry(cryptoPerfectResult);
}

async function runCryptoPm1(event) {
  if (event) event.preventDefault();
  const nRaw = cryptoPm1N.value.trim();
  const b1Raw = cryptoPm1B1.value.trim();
  const b2Raw = cryptoPm1B2.value.trim();

  if (!/^[1-9]\d*$/.test(nRaw)) {
    cryptoPm1Result.textContent = "Enter a valid integer n ≥ 3.";
    return;
  }
  const nVal = BigInt(nRaw);
  if (nVal < 3n) {
    cryptoPm1Result.textContent = "Integer n must be composite and ≥ 3.";
    return;
  }

  const queryParams = new URLSearchParams({ n: nRaw });
  if (b1Raw && /^[1-9]\d*$/.test(b1Raw)) queryParams.set("b1", b1Raw);
  if (b2Raw && /^[1-9]\d*$/.test(b2Raw)) queryParams.set("b2", b2Raw);

  const button = cryptoPm1Form.querySelector("button[type='submit']");
  cryptoPm1Result.textContent = "Factoring via Pollard's p - 1...";
  setBusy(button, true, "Factoring");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/pm1?${queryParams.toString()}`,
      {},
      cryptoPm1Result
    );
    if (data.success && data.factor) {
      const stageLabel = data.stage === 1 ? "Stage 1" : data.stage === 2 ? "Stage 2" : "Initial GCD";
      let html = `<strong>${data.n.toLocaleString()}</strong> = <code>${data.factor.toLocaleString()} &times; ${data.cofactor.toLocaleString()}</code><br>` +
        `<span class="lab-muted">Found in <strong>${stageLabel}</strong> (B1 = ${data.b1.toLocaleString()}, B2 = ${data.b2.toLocaleString()}) &bull; ${data.steps} ${data.steps === 1 ? "step" : "steps"} in ${data.elapsed_us.toLocaleString()} &mu;s</span>`;
      if (data.p_minus_1_expression) {
        html += `<br><span class="lab-muted">Smoothness: p &minus; 1 = ${data.p_minus_1.toLocaleString()} = <code>${data.p_minus_1_expression}</code></span>`;
      }
      cryptoPm1Result.innerHTML = html;
    } else {
      cryptoPm1Result.innerHTML = `<strong>${data.n.toLocaleString()}</strong>: ${data.message}<br>` +
        `<span class="lab-muted">Evaluated ${data.steps} steps (B1 = ${data.b1.toLocaleString()}, B2 = ${data.b2.toLocaleString()}) in ${data.elapsed_us.toLocaleString()} &mu;s</span>`;
    }
  } catch (error) {
    cryptoPm1Result.textContent = error.message;
  } finally {
    setBusy(button, false, "Factor via p - 1");
  }
}

function clearCryptoPm1() {
  cryptoPm1N.value = "1393429";
  cryptoPm1B1.value = "20";
  cryptoPm1B2.value = "100";
  cryptoPm1Result.textContent = "Enter composite n and smoothness bounds B1, B2.";
  clearTelemetry(cryptoPm1Result);
}

async function runCryptoTotient(event) {
  event.preventDefault();
  const nRaw = cryptoTotientN.value.trim();
  if (!/^[1-9]\d*$/.test(nRaw)) {
    cryptoTotientResult.textContent = "Enter a valid positive integer n ≥ 1.";
    return;
  }
  const button = cryptoTotientForm.querySelector("button[type='submit']");
  cryptoTotientResult.textContent = "Computing totient & Carmichael functions...";
  setBusy(button, true, "Computing");
  try {
    const data = await fetchCryptoJson(`/v1/math/totient?n=${encodeURIComponent(nRaw)}`, {}, cryptoTotientResult);
    const cyclicText = data.is_cyclic ? "cyclic (primitive roots exist &check;)" : "not cyclic";
    cryptoTotientResult.innerHTML = `&phi;(${data.n}) = <strong>${data.phi}</strong>, &lambda;(${data.n}) = <strong>${data.lambda}</strong> &mdash; <em>${cyclicText}</em>`;
  } catch (error) {
    cryptoTotientResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Computing");
  }
}

function clearCryptoTotient() {
  cryptoTotientN.value = "360";
  cryptoTotientResult.textContent = "Enter positive integer n (up to 2⁶³ - 1).";
  clearTelemetry(cryptoTotientResult);
}

async function runCryptoOrder(event) {
  event.preventDefault();
  const aRaw = cryptoOrderA.value.trim();
  const mRaw = cryptoOrderM.value.trim();
  const a = Number(aRaw);
  const m = Number(mRaw);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(m) || m <= 1) {
    cryptoOrderResult.textContent = "Enter an integer base a and modulus m > 1.";
    return;
  }
  const button = cryptoOrderForm.querySelector("button[type='submit']");
  cryptoOrderResult.textContent = "Computing multiplicative order...";
  setBusy(button, true, "Computing");
  try {
    const data = await fetchCryptoJson(`/v1/math/order?a=${encodeURIComponent(a)}&m=${encodeURIComponent(m)}`, {}, cryptoOrderResult);
    const primRootText = data.is_primitive_root ? "primitive root &check;" : "not a primitive root";
    cryptoOrderResult.innerHTML = `ord<sub>${data.m}</sub>(${data.a}) = <strong>${data.order}</strong> &mdash; <em>${primRootText}</em>`;
  } catch (error) {
    cryptoOrderResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Computing");
  }
}

function clearCryptoOrder() {
  cryptoOrderA.value = "3";
  cryptoOrderM.value = "7";
  cryptoOrderResult.textContent = "Enter coprime a and modulus m > 1.";
  clearTelemetry(cryptoOrderResult);
}

async function runCryptoDlog(event) {
  event.preventDefault();
  const gRaw = cryptoDlogG.value.trim();
  const hRaw = cryptoDlogH.value.trim();
  const pRaw = cryptoDlogP.value.trim();
  const g = Number(gRaw);
  const h = Number(hRaw);
  const p = Number(pRaw);
  if (!Number.isSafeInteger(g) || !Number.isSafeInteger(h) || !Number.isSafeInteger(p) || p <= 1) {
    cryptoDlogResult.textContent = "Enter valid integers g, h, and modulus p > 1.";
    return;
  }
  const button = cryptoDlogForm.querySelector("button[type='submit']");
  cryptoDlogResult.textContent = "Solving discrete logarithm...";
  setBusy(button, true, "Solving");
  try {
    const data = await fetchCryptoJson(`/v1/math/dlog?g=${encodeURIComponent(g)}&h=${encodeURIComponent(h)}&p=${encodeURIComponent(p)}`, {}, cryptoDlogResult);
    cryptoDlogResult.innerHTML = `${data.g}<sup>${data.x}</sup> &equiv; ${data.h} (mod ${data.p}) &mdash; <em>ord<sub>${data.p}</sub>(${data.g}) = ${data.order}</em>`;
  } catch (error) {
    cryptoDlogResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Solving");
  }
}

function clearCryptoDlog() {
  cryptoDlogG.value = "2";
  cryptoDlogH.value = "5";
  cryptoDlogP.value = "13";
  cryptoDlogResult.textContent = "Enter base g, target h, and modulus p > 1.";
  clearTelemetry(cryptoDlogResult);
}

async function runCryptoArith(event) {
  event.preventDefault();
  const nRaw = cryptoArithN.value.trim();
  const kRaw = cryptoArithK.value.trim();
  if (!/^[1-9]\d*$/.test(nRaw)) {
    cryptoArithResult.textContent = "Enter a valid positive integer n ≥ 1.";
    return;
  }
  const k = kRaw === "" ? 1 : Number(kRaw);
  if (!Number.isSafeInteger(k) || k < 0) {
    cryptoArithResult.textContent = "Exponent k must be an integer ≥ 0.";
    return;
  }
  const button = cryptoArithForm.querySelector("button[type='submit']");
  cryptoArithResult.textContent = "Evaluating arithmetic functions...";
  setBusy(button, true, "Evaluating");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/arith?n=${encodeURIComponent(nRaw)}&k=${encodeURIComponent(k)}`,
      {},
      cryptoArithResult,
    );
    const sigLabel = data.k === 1 ? "&sigma;" : `&sigma;<sub>${data.k}</sub>`;
    cryptoArithResult.innerHTML = `&mu;(${data.n}) = <strong>${data.mobius}</strong>, ${sigLabel}(${data.n}) = <strong>${data.sigma}</strong>, &tau;(${data.n}) = <strong>${data.tau}</strong>`;
  } catch (error) {
    cryptoArithResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Evaluating");
  }
}

function clearCryptoArith() {
  cryptoArithN.value = "12";
  cryptoArithK.value = "1";
  cryptoArithResult.textContent = "Enter positive integer n (up to 2⁶³ - 1).";
  clearTelemetry(cryptoArithResult);
}

async function runCryptoJacobi(event) {
  event.preventDefault();
  const aRaw = cryptoJacobiA.value.trim();
  const nRaw = cryptoJacobiN.value.trim();
  const a = Number(aRaw);
  const n = Number(nRaw);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(n) || n < 1 || n % 2 === 0) {
    cryptoJacobiResult.textContent = "Enter integer a and a positive odd integer n ≥ 1.";
    return;
  }
  const button = cryptoJacobiForm.querySelector("button[type='submit']");
  cryptoJacobiResult.textContent = "Computing (a/n)...";
  setBusy(button, true, "Computing");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/jacobi?a=${encodeURIComponent(a)}&n=${encodeURIComponent(n)}`,
      {},
      cryptoJacobiResult,
    );
    const desc =
      data.value === 1
        ? "Jacobi symbol = 1"
        : data.value === -1
          ? "Jacobi symbol = -1 (quadratic non-residue)"
          : "gcd(a, n) > 1";
    cryptoJacobiResult.innerHTML = `(${data.a}/${data.n}) = <strong>${data.value}</strong> <em>(${desc})</em>`;
  } catch (error) {
    cryptoJacobiResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Computing");
  }
}

function clearCryptoJacobi() {
  cryptoJacobiA.value = "10";
  cryptoJacobiN.value = "21";
  cryptoJacobiResult.textContent = "Enter integer a and positive odd integer n.";
  clearTelemetry(cryptoJacobiResult);
}

async function runCryptoSolovay(event) {
  event.preventDefault();
  const nRaw = cryptoSolovayN.value.trim();
  const roundsRaw = cryptoSolovayRounds.value.trim();
  if (!/^[1-9]\d*$/.test(nRaw) || Number(nRaw) < 2) {
    cryptoSolovayResult.textContent = "Enter a valid integer n ≥ 2.";
    return;
  }
  const rounds = roundsRaw === "" ? 20 : Number(roundsRaw);
  if (!Number.isSafeInteger(rounds) || rounds < 1 || rounds > 100) {
    cryptoSolovayResult.textContent = "Rounds must be an integer between 1 and 100.";
    return;
  }
  const button = cryptoSolovayForm.querySelector("button[type='submit']");
  cryptoSolovayResult.textContent = "Testing primality...";
  setBusy(button, true, "Testing");
  try {
    const data = await fetchCryptoJson(
      `/v1/math/solovay?n=${encodeURIComponent(nRaw)}&rounds=${encodeURIComponent(rounds)}`,
      {},
      cryptoSolovayResult,
    );
    if (data.is_prime) {
      cryptoSolovayResult.innerHTML = `<strong>${data.n}</strong> is <strong>probably prime</strong> (Solovay–Strassen, ${data.rounds} rounds, error &le; 2<sup>-${data.rounds}</sup>)`;
    } else {
      cryptoSolovayResult.innerHTML = `<strong>${data.n}</strong> is <strong>composite</strong> (Euler witness found)`;
    }
  } catch (error) {
    cryptoSolovayResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Testing");
  }
}

function clearCryptoSolovay() {
  cryptoSolovayN.value = "104729";
  cryptoSolovayRounds.value = "20";
  cryptoSolovayResult.textContent = "Enter integer n > 1 and rounds k.";
  clearTelemetry(cryptoSolovayResult);
}

function syncRsaForm() {
  const action = cryptoRsaAction?.value || "keygen";
  if (cryptoRsaKeygenGroup) cryptoRsaKeygenGroup.style.display = action === "keygen" ? "block" : "none";
  if (cryptoRsaEncryptGroup) cryptoRsaEncryptGroup.style.display = action === "encrypt" ? "block" : "none";
  if (cryptoRsaDecryptGroup) cryptoRsaDecryptGroup.style.display = action === "decrypt" ? "block" : "none";
  if (cryptoRsaCrackGroup) cryptoRsaCrackGroup.style.display = action === "crack" ? "block" : "none";

  if (submitCryptoRsa) {
    switch (action) {
      case "keygen":
        submitCryptoRsa.textContent = "Generate keypair";
        break;
      case "encrypt":
        submitCryptoRsa.textContent = "Encrypt message";
        break;
      case "decrypt":
        submitCryptoRsa.textContent = "Decrypt ciphertext";
        break;
      case "crack":
        submitCryptoRsa.textContent = "Crack RSA modulus";
        break;
    }
  }
}

async function runCryptoRsa(event) {
  event.preventDefault();
  const action = cryptoRsaAction.value;
  const button = submitCryptoRsa;

  try {
    if (action === "keygen") {
      const bits = parseInt(cryptoRsaBits.value, 10) || 32;
      const e = parseInt(cryptoRsaEGen.value, 10) || 65537;
      if (bits < 8 || bits > 62) {
        cryptoRsaResult.textContent = "Modulus bit length must be between 8 and 62.";
        return;
      }
      if (e < 3 || e % 2 === 0) {
        cryptoRsaResult.textContent = "Public exponent e must be an odd integer ≥ 3.";
        return;
      }
      cryptoRsaResult.textContent = "Generating RSA keypair...";
      setBusy(button, true, "Generating");

      const data = await fetchCryptoJson(
        `/v1/math/rsa/keygen?bits=${bits}&e=${e}`,
        {},
        cryptoRsaResult,
      );

      // Auto-populate other RSA fields for seamless playground exploration
      if (cryptoRsaEncN) cryptoRsaEncN.value = String(data.n);
      if (cryptoRsaEncE) cryptoRsaEncE.value = String(data.e);
      if (cryptoRsaDecN) cryptoRsaDecN.value = String(data.n);
      if (cryptoRsaD) cryptoRsaD.value = String(data.d);
      if (cryptoRsaP) cryptoRsaP.value = String(data.p);
      if (cryptoRsaQ) cryptoRsaQ.value = String(data.q);
      if (cryptoRsaCrackN) cryptoRsaCrackN.value = String(data.n);
      if (cryptoRsaCrackE) cryptoRsaCrackE.value = String(data.e);

      cryptoRsaResult.innerHTML = `
        <strong>RSA Keypair Generated (${bits}-bit):</strong><br>
        Modulus n: <code>${data.n}</code> (${data.p} &times; ${data.q})<br>
        Public Exponent e: <code>${data.e}</code> | Private Exponent d: <code>${data.d}</code><br>
        Totient &phi;(n): <code>${data.phi}</code> | Carmichael &lambda;(n): <code>${data.lambda}</code><br>
        CRT Components: d<sub>p</sub> = <code>${data.dp}</code>, d<sub>q</sub> = <code>${data.dq}</code>, q<sub>inv</sub> = <code>${data.qinv}</code>
      `;
    } else if (action === "encrypt") {
      const m = cryptoRsaM.value.trim();
      const e = cryptoRsaEncE.value.trim();
      const n = cryptoRsaEncN.value.trim();
      if (!m || !e || !n) {
        cryptoRsaResult.textContent = "Message m, exponent e, and modulus n are required.";
        return;
      }
      cryptoRsaResult.textContent = "Encrypting message...";
      setBusy(button, true, "Encrypting");

      const data = await fetchCryptoJson(
        `/v1/math/rsa/encrypt?m=${encodeURIComponent(m)}&e=${encodeURIComponent(e)}&n=${encodeURIComponent(n)}`,
        {},
        cryptoRsaResult,
      );

      // Auto-populate decrypt & crack ciphertext fields
      if (cryptoRsaC) cryptoRsaC.value = String(data.c);
      if (cryptoRsaCrackC) cryptoRsaCrackC.value = String(data.c);

      cryptoRsaResult.innerHTML = `
        <strong>Ciphertext c:</strong> <code>${data.c}</code><br>
        <em>Calculation: ${data.m}<sup>${data.e}</sup> mod ${data.n} = ${data.c}</em>
      `;
    } else if (action === "decrypt") {
      const c = cryptoRsaC.value.trim();
      const d = cryptoRsaD.value.trim();
      const n = cryptoRsaDecN.value.trim();
      const p = cryptoRsaP.value.trim();
      const q = cryptoRsaQ.value.trim();
      if (!c || !d || !n) {
        cryptoRsaResult.textContent = "Ciphertext c, private exponent d, and modulus n are required.";
        return;
      }
      let query = `/v1/math/rsa/decrypt?c=${encodeURIComponent(c)}&d=${encodeURIComponent(d)}&n=${encodeURIComponent(n)}`;
      if (p && q) {
        query += `&p=${encodeURIComponent(p)}&q=${encodeURIComponent(q)}`;
      }
      cryptoRsaResult.textContent = "Decrypting ciphertext...";
      setBusy(button, true, "Decrypting");

      const data = await fetchCryptoJson(query, {}, cryptoRsaResult);

      cryptoRsaResult.innerHTML = `
        <strong>Plaintext message m:</strong> <code>${data.m}</code><br>
        <em>${data.crt_used ? "Decrypted with Chinese Remainder Theorem (CRT) acceleration." : "Decrypted with direct modular exponentiation (c^d mod n)."}</em>
      `;
    } else if (action === "crack") {
      const n = cryptoRsaCrackN.value.trim();
      const e = cryptoRsaCrackE.value.trim();
      const c = cryptoRsaCrackC.value.trim();
      if (!n || !e) {
        cryptoRsaResult.textContent = "Modulus n and public exponent e are required.";
        return;
      }
      let query = `/v1/math/rsa/crack?n=${encodeURIComponent(n)}&e=${encodeURIComponent(e)}`;
      if (c) {
        query += `&c=${encodeURIComponent(c)}`;
      }
      cryptoRsaResult.textContent = "Factoring modulus and cracking key...";
      setBusy(button, true, "Cracking");

      const data = await fetchCryptoJson(query, {}, cryptoRsaResult);

      let msg = `
        <strong>RSA Modulus Cracked!</strong><br>
        Prime factors: p = <code>${data.p}</code>, q = <code>${data.q}</code><br>
        Private exponent recovered: d = <code>${data.d}</code> (&lambda; = ${data.lambda})
      `;
      if (data.m !== undefined && data.m !== null) {
        msg += `<br>Intercepted ciphertext <code>${data.c}</code> decrypted to m = <strong>${data.m}</strong>`;
      }
      cryptoRsaResult.innerHTML = msg;
    }
  } catch (error) {
    cryptoRsaResult.textContent = error.message;
  } finally {
    setBusy(button, false, submitCryptoRsa.textContent);
  }
}

function clearCryptoRsa() {
  cryptoRsaBits.value = "32";
  cryptoRsaEGen.value = "65537";
  cryptoRsaM.value = "42";
  cryptoRsaEncE.value = "65537";
  cryptoRsaEncN.value = "3233";
  cryptoRsaC.value = "2557";
  cryptoRsaD.value = "2753";
  cryptoRsaDecN.value = "3233";
  cryptoRsaP.value = "";
  cryptoRsaQ.value = "";
  cryptoRsaCrackN.value = "3233";
  cryptoRsaCrackE.value = "17";
  cryptoRsaCrackC.value = "2557";
  cryptoRsaResult.textContent = "Select an operation and configure parameters.";
  clearTelemetry(cryptoRsaResult);
}

function syncDhForm() {
  const action = cryptoDhAction?.value || "keygen";
  if (cryptoDhKeygenGroup) cryptoDhKeygenGroup.style.display = action === "keygen" ? "block" : "none";
  if (cryptoDhDeriveGroup) cryptoDhDeriveGroup.style.display = action === "derive" ? "block" : "none";
  if (cryptoDhCrackGroup) cryptoDhCrackGroup.style.display = action === "crack" ? "block" : "none";

  if (submitCryptoDh) {
    switch (action) {
      case "keygen":
        submitCryptoDh.textContent = "Generate key";
        break;
      case "derive":
        submitCryptoDh.textContent = "Derive shared secret";
        break;
      case "crack":
        submitCryptoDh.textContent = "Crack private key";
        break;
    }
  }
}

async function runCryptoDh(event) {
  event.preventDefault();
  const action = cryptoDhAction.value;
  const button = submitCryptoDh;

  try {
    if (action === "keygen") {
      const p = cryptoDhP.value.trim();
      const g = cryptoDhG.value.trim();
      const priv = cryptoDhPriv.value.trim();
      if (!p || !g) {
        cryptoDhResult.textContent = "Prime modulus p and generator g are required.";
        return;
      }
      let query = `/v1/math/dh/keygen?p=${encodeURIComponent(p)}&g=${encodeURIComponent(g)}`;
      if (priv) {
        query += `&private_key=${encodeURIComponent(priv)}`;
      }
      cryptoDhResult.textContent = "Generating DH keypair...";
      setBusy(button, true, "Generating");

      const data = await fetchCryptoJson(query, {}, cryptoDhResult);

      // Auto-populate derive and crack fields
      if (cryptoDhDerivePriv) cryptoDhDerivePriv.value = String(data.private_key);
      if (cryptoDhDeriveP) cryptoDhDeriveP.value = String(data.p);
      if (cryptoDhCrackG) cryptoDhCrackG.value = String(data.g);
      if (cryptoDhCrackPub) cryptoDhCrackPub.value = String(data.public_key);
      if (cryptoDhCrackP) cryptoDhCrackP.value = String(data.p);

      cryptoDhResult.innerHTML = `
        <strong>Diffie–Hellman Keypair Generated:</strong><br>
        Public Key A: <code>${data.public_key}</code> (${data.g}<sup>${data.private_key}</sup> mod ${data.p})<br>
        Private Key a: <code>${data.private_key}</code>
      `;
    } else if (action === "derive") {
      const priv = cryptoDhDerivePriv.value.trim();
      const pub = cryptoDhDerivePub.value.trim();
      const p = cryptoDhDeriveP.value.trim();
      if (!priv || !pub || !p) {
        cryptoDhResult.textContent = "Private key a, peer public key B, and modulus p are required.";
        return;
      }
      cryptoDhResult.textContent = "Deriving shared secret...";
      setBusy(button, true, "Deriving");

      const data = await fetchCryptoJson(
        `/v1/math/dh/derive?private_key=${encodeURIComponent(priv)}&peer_public_key=${encodeURIComponent(pub)}&p=${encodeURIComponent(p)}`,
        {},
        cryptoDhResult,
      );

      cryptoDhResult.innerHTML = `
        <strong>Shared Secret S:</strong> <code>${data.shared_secret}</code><br>
        <em>Calculation: ${data.peer_public_key}<sup>${data.private_key}</sup> mod ${data.p} = ${data.shared_secret}</em>
      `;
    } else if (action === "crack") {
      const g = cryptoDhCrackG.value.trim();
      const pub = cryptoDhCrackPub.value.trim();
      const p = cryptoDhCrackP.value.trim();
      if (!g || !pub || !p) {
        cryptoDhResult.textContent = "Generator g, public key A, and modulus p are required.";
        return;
      }
      cryptoDhResult.textContent = "Solving discrete logarithm...";
      setBusy(button, true, "Cracking");

      const data = await fetchCryptoJson(
        `/v1/math/dh/crack?g=${encodeURIComponent(g)}&public_key=${encodeURIComponent(pub)}&p=${encodeURIComponent(p)}`,
        {},
        cryptoDhResult,
      );

      cryptoDhResult.innerHTML = `
        <strong>Private Key Recovered via BSGS:</strong> a = <code>${data.private_key}</code><br>
        <em>Verification: ${data.g}<sup>${data.private_key}</sup> mod ${data.p} = ${data.public_key}</em>
      `;
    }
  } catch (error) {
    cryptoDhResult.textContent = error.message;
  } finally {
    setBusy(button, false, submitCryptoDh.textContent);
  }
}

function clearCryptoDh() {
  cryptoDhP.value = "23";
  cryptoDhG.value = "5";
  cryptoDhPriv.value = "6";
  cryptoDhDerivePriv.value = "6";
  cryptoDhDerivePub.value = "19";
  cryptoDhDeriveP.value = "23";
  cryptoDhCrackG.value = "5";
  cryptoDhCrackPub.value = "8";
  cryptoDhCrackP.value = "23";
  cryptoDhResult.textContent = "Select an operation and configure parameters.";
  clearTelemetry(cryptoDhResult);
}

async function runChallenge(event) {
  event.preventDefault();
  const topic = challengeTopic.value;
  const seedVal = challengeSeed.value.trim();
  let query = `/v1/math/challenge?topic=${encodeURIComponent(topic)}&count=1`;
  if (seedVal) {
    query += `&seed=${encodeURIComponent(seedVal)}`;
  }
  const button = challengeForm.querySelector("button[type='submit']");
  challengeResult.textContent = "Generating problem...";
  setBusy(button, true, "Generating");
  try {
    const data = await fetchCryptoJson(query, {}, challengeResult);
    const prob = data.problems && data.problems[0];
    if (prob) {
      challengeResult.innerHTML = `
        <div style="margin-bottom:0.6rem"><strong>${prob.question}</strong></div>
        <details style="cursor:pointer">
          <summary style="color:var(--lab-accent);font-weight:600">Reveal Answer</summary>
          <div style="margin-top:0.4rem;font-size:1.05em">Answer: <strong>${prob.answer}</strong></div>
        </details>
      `;
    } else {
      challengeResult.textContent = "No challenge returned.";
    }
  } catch (error) {
    challengeResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Generating");
  }
}

function clearChallenge() {
  challengeTopic.value = "mixed";
  challengeSeed.value = "";
  challengeResult.textContent = "Generate a problem to test your math & crypto skills.";
  clearTelemetry(challengeResult);
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
previousPrimeForm.addEventListener("submit", lookupPreviousPrime);
previousPrimeInput.addEventListener("input", () => validatePrimeInput(previousPrimeInput, 3, previousPrimeResult));
clearPreviousPrimeButton.addEventListener("click", clearPreviousPrime);
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
divisorCountForm.addEventListener("submit", lookupDivisorCount);
divisorCountInput.addEventListener("input", () => validatePrimeInput(divisorCountInput, 0, divisorCountResult));
clearDivisorCountButton.addEventListener("click", clearDivisorCount);
divisorSumForm.addEventListener("submit", lookupDivisorSum);
divisorSumInput.addEventListener("input", () => validatePrimeInput(divisorSumInput, 0, divisorSumResult));
clearDivisorSumButton.addEventListener("click", clearDivisorSum);
divisorsForm.addEventListener("submit", lookupDivisors);
divisorsInput.addEventListener("input", () => validatePrimeInput(divisorsInput, 0, divisorsResult));
clearDivisorsButton.addEventListener("click", clearDivisors);
snapshotForm.addEventListener("submit", loadSnapshot);
clearSnapshotButton.addEventListener("click", clearSnapshot);
hashForm.addEventListener("submit", runHash);
clearHashButton.addEventListener("click", clearHash);
hmacForm.addEventListener("submit", runHmac);
clearHmacButton.addEventListener("click", clearHmac);
hmacOperation.addEventListener("change", syncHmacForm);

sqrtmodForm?.addEventListener("submit", runSqrtmod);
clearSqrtmodButton?.addEventListener("click", clearSqrtmod);
legendreForm?.addEventListener("submit", runLegendre);
clearLegendreButton?.addEventListener("click", clearLegendre);
ecmulForm?.addEventListener("submit", runEcmul);
clearEcmulButton?.addEventListener("click", clearEcmul);
crtForm?.addEventListener("submit", runCrt);
clearCrtButton?.addEventListener("click", clearCrt);
cryptoFactorForm?.addEventListener("submit", runCryptoFactor);
clearCryptoFactorButton?.addEventListener("click", clearCryptoFactor);
cryptoFermatForm?.addEventListener("submit", runCryptoFermat);
clearCryptoFermatButton?.addEventListener("click", clearCryptoFermat);
cryptoMersenneAction?.addEventListener("change", syncMersenneForm);
cryptoMersenneForm?.addEventListener("submit", runCryptoMersenne);
clearCryptoMersenneButton?.addEventListener("click", clearCryptoMersenne);
document.querySelectorAll(".mersenne-preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const pVal = btn.getAttribute("data-p");
    if (cryptoMersenneAction) cryptoMersenneAction.value = "test";
    syncMersenneForm();
    if (cryptoMersenneP) cryptoMersenneP.value = pVal;
    runCryptoMersenne();
  });
});
cryptoPerfectForm?.addEventListener("submit", runCryptoPerfect);
clearCryptoPerfectButton?.addEventListener("click", clearCryptoPerfect);
cryptoPm1Form?.addEventListener("submit", runCryptoPm1);
clearCryptoPm1Button?.addEventListener("click", clearCryptoPm1);
document.querySelectorAll(".pm1-preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (cryptoPm1N && btn.dataset.n) cryptoPm1N.value = btn.dataset.n;
    if (cryptoPm1B1 && btn.dataset.b1) cryptoPm1B1.value = btn.dataset.b1;
    if (cryptoPm1B2 && btn.dataset.b2) cryptoPm1B2.value = btn.dataset.b2;
    runCryptoPm1();
  });
});
cryptoTotientForm?.addEventListener("submit", runCryptoTotient);
clearCryptoTotientButton?.addEventListener("click", clearCryptoTotient);
cryptoOrderForm?.addEventListener("submit", runCryptoOrder);
clearCryptoOrderButton?.addEventListener("click", clearCryptoOrder);
cryptoDlogForm?.addEventListener("submit", runCryptoDlog);
clearCryptoDlogButton?.addEventListener("click", clearCryptoDlog);
cryptoArithForm?.addEventListener("submit", runCryptoArith);
clearCryptoArithButton?.addEventListener("click", clearCryptoArith);
cryptoJacobiForm?.addEventListener("submit", runCryptoJacobi);
clearCryptoJacobiButton?.addEventListener("click", clearCryptoJacobi);
cryptoSolovayForm?.addEventListener("submit", runCryptoSolovay);
clearCryptoSolovayButton?.addEventListener("click", clearCryptoSolovay);
cryptoRsaAction?.addEventListener("change", syncRsaForm);
cryptoRsaForm?.addEventListener("submit", runCryptoRsa);
clearCryptoRsaButton?.addEventListener("click", clearCryptoRsa);
cryptoDhAction?.addEventListener("change", syncDhForm);
cryptoDhForm?.addEventListener("submit", runCryptoDh);
clearCryptoDhButton?.addEventListener("click", clearCryptoDh);
challengeForm?.addEventListener("submit", runChallenge);
clearChallengeButton?.addEventListener("click", clearChallenge);

initLorenzSimulation();
initStegoInspector();
initLabFilters();
refreshHealth();
refreshInfo();
refreshCryptoHealth();
refreshCryptoInfo();
syncHmacForm();
syncRsaForm();
syncDhForm();
syncMersenneForm();
validateCatalanInput();
validateFibonacciInput();
validateGcdInputs();
validatePrimeInput(primeInput, 0, primeResult);
validatePrimeInput(nextPrimeInput, 0, nextPrimeResult);
validatePrimeInput(previousPrimeInput, 3, previousPrimeResult);
validatePrimeInput(primeGapInput, 3, primeGapResult);
validatePrimeInput(primePiInput, 0, primePiResult);
validatePrimeInput(factorInput, 0, factorResult);
validatePrimeInput(totientInput, 0, totientResult);
validatePrimeInput(mobiusInput, 0, mobiusResult);
validatePrimeInput(divisorCountInput, 0, divisorCountResult);
validatePrimeInput(divisorSumInput, 0, divisorSumResult);
validatePrimeInput(divisorsInput, 0, divisorsResult);
