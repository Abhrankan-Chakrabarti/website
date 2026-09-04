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
const refreshInfoButton = document.querySelector("#refresh-info");
const infoOutput = document.querySelector("#info-output");
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
const cryptoHealthBadge = document.querySelector("#crypto-health-badge");
const cryptoHealthMessage = document.querySelector("#crypto-health-message");

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

async function refreshCryptoHealth() {
  cryptoHealthBadge.textContent = "Checking";
  cryptoHealthBadge.className = "status-badge status-badge--idle";

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
  if (!Number.isInteger(n) || n < 0) {
    catalanResult.textContent = "Enter a non-negative integer.";
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
    ["API", data.api],
    ["Version", data.version],
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

async function refreshInfo() {
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
    setBusy(button, false, "Loading");
  }
}

function clearSnapshot() {
  snapshotPassword.value = "";
  snapshotOutput.textContent =
    "Credentials are sent only with this request and are not stored by this page.";
}

refreshHealthButton.addEventListener("click", refreshHealth);
refreshInfoButton.addEventListener("click", refreshInfo);
catalanForm.addEventListener("submit", lookupCatalan);
snapshotForm.addEventListener("submit", loadSnapshot);
clearSnapshotButton.addEventListener("click", clearSnapshot);
hashForm.addEventListener("submit", runHash);
hmacForm.addEventListener("submit", runHmac);
hmacOperation.addEventListener("change", syncHmacForm);

refreshHealth();
refreshInfo();
refreshCryptoHealth();
syncHmacForm();
