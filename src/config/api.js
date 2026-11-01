export const API_BASE_URL = 'https://backend.plantriponline.com';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Standard public fetch — no auth token */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });
};

/** Admin / authenticated fetch — injects Bearer token from localStorage */
export const adminFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const url   = `${API_BASE_URL}${endpoint}`;
  return await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

/** Convenience wrapper — returns parsed JSON or throws with message */
export const adminGet = async (endpoint) => {
  const res = await adminFetch(endpoint);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

export const adminPost = async (endpoint, body) => {
  const res = await adminFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

export const adminPut = async (endpoint, body) => {
  const res = await adminFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

export const adminDelete = async (endpoint) => {
  const res = await adminFetch(endpoint, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

/** Public POST — for bookings, enquiries, promo validation */
export const publicPost = async (endpoint, body) => {
  const res = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};
