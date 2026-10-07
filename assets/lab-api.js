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

async function fetchJson(path, options = {}) {
  const response = await fetch(endpoint(path), {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? body.error
        : `Request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

async function fetchCryptoJson(path, options = {}) {
  const response = await fetch(`${CRYPTO_API_BASE.replace(/\/$/, "")}${path}`, {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? body.error
        : `Request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
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
  catalanResult.textContent = "Enter an integer from 0 to 34.";
}

function clearHash() {
  hashData.value = "hello";
  hashUsername.value = "";
  hashPassword.value = "";
  hashResult.textContent = "Your digest will appear here.";
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
    const data = await fetchJson(`/v1/math/fibonacci/${n}`);
    fibonacciResult.innerHTML = `F<sub>${data.n}</sub> = <strong>${data.value}</strong>`;
  } catch (error) {
    fibonacciResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Calculating");
  }
}

async function lookupGcd(event) {
  event.preventDefault();

  let a;
  let b;
  try {
    a = BigInt(gcdAInput.value);
    b = BigInt(gcdBInput.value);
  } catch {
    gcdResult.textContent = "Enter two integers from 0 to 18,446,744,073,709,551,615.";
    return;
  }

  const maxU64 = 18446744073709551615n;
  if (a < 0n || b < 0n || a > maxU64 || b > maxU64) {
    gcdResult.textContent = "Enter two integers from 0 to 18,446,744,073,709,551,615.";
    return;
  }

  const button = gcdForm.querySelector("button[type='submit']");
  gcdResult.textContent = "Calculating...";
  setBusy(button, true, "Calculating");

  try {
    await fetchJson(`/v1/math/gcd/${a}/${b}`);
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

function clearFibonacci() {
  fibonacciInput.value = "10";
  fibonacciResult.textContent = "Enter an integer from 0 to 186.";
}

function clearGcd() {
  gcdAInput.value = "84";
  gcdBInput.value = "30";
  gcdResult.textContent = "Enter two integers from 0 to 18,446,744,073,709,551,615.";
}

function primeInputValue(input, result, minimum) {
  const n = Number(input.value);
  if (!Number.isSafeInteger(n) || n < minimum || n > 1000000) {
    result.textContent = `Enter an integer from ${minimum.toLocaleString()} to 1,000,000.`;
    return null;
  }
  return n;
}

async function lookupPrime(event) {
  event.preventDefault();
  const n = primeInputValue(primeInput, primeResult, 0);
  if (n === null) return;
  const button = primeForm.querySelector("button[type='submit']");
  primeResult.textContent = "Checking...";
  setBusy(button, true, "Checking");
  try {
    const data = await fetchJson(`/v1/math/is-prime/${n}`);
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
    const data = await fetchJson(`/v1/math/next-prime/${n}`);
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
    const data = await fetchJson(`/v1/math/prime-gap/${n}`);
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
    const data = await fetchJson(`/v1/math/prime-pi/${n}`);
    primePiResult.innerHTML = `π(${data.n}) = <strong>${data.value}</strong>`;
  } catch (error) {
    primePiResult.textContent = error.message;
  } finally {
    setBusy(button, false, "Counting");
  }
}

function clearPrime() {
  primeInput.value = "97";
  primeResult.textContent = "Enter an integer from 0 to 1,000,000.";
}

function clearNextPrime() {
  nextPrimeInput.value = "100";
  nextPrimeResult.textContent = "Enter an integer from 0 to 1,000,000.";
}

function clearPrimeGap() {
  primeGapInput.value = "1000";
  primeGapResult.textContent = "Enter an integer from 3 to 1,000,000.";
}

function clearPrimePi() {
  primePiInput.value = "1000";
  primePiResult.textContent = "Enter an integer from 0 to 1,000,000.";
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
    const data = await fetchJson(`/v1/catalan/${n}`);
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

refreshHealthButton.addEventListener("click", refreshHealth);
refreshCryptoHealthButton.addEventListener("click", refreshCryptoHealth);
refreshInfoButton.addEventListener("click", refreshInfo);
refreshCryptoInfoButton.addEventListener("click", refreshCryptoInfo);
catalanForm.addEventListener("submit", lookupCatalan);
clearCatalanButton.addEventListener("click", clearCatalan);
fibonacciForm.addEventListener("submit", lookupFibonacci);
clearFibonacciButton.addEventListener("click", clearFibonacci);
gcdForm.addEventListener("submit", lookupGcd);
clearGcdButton.addEventListener("click", clearGcd);
primeForm.addEventListener("submit", lookupPrime);
clearPrimeButton.addEventListener("click", clearPrime);
nextPrimeForm.addEventListener("submit", lookupNextPrime);
clearNextPrimeButton.addEventListener("click", clearNextPrime);
primeGapForm.addEventListener("submit", lookupPrimeGap);
clearPrimeGapButton.addEventListener("click", clearPrimeGap);
primePiForm.addEventListener("submit", lookupPrimePi);
clearPrimePiButton.addEventListener("click", clearPrimePi);
snapshotForm.addEventListener("submit", loadSnapshot);
clearSnapshotButton.addEventListener("click", clearSnapshot);
hashForm.addEventListener("submit", runHash);
clearHashButton.addEventListener("click", clearHash);
hmacForm.addEventListener("submit", runHmac);
clearHmacButton.addEventListener("click", clearHmac);
hmacOperation.addEventListener("change", syncHmacForm);

refreshHealth();
refreshInfo();
refreshCryptoHealth();
refreshCryptoInfo();
syncHmacForm();
