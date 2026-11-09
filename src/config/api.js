export const API_BASE_URL = 'https://backend.plantriponline.com';

// ── 401 handler ───────────────────────────────────────────────────────────────
// Called whenever any admin request gets a 401 Unauthorized response.
// Clears local storage and redirects to /login.
function handle401() {
  ['token', 'userRole', 'userName', 'userEmail'].forEach(k => localStorage.removeItem(k));
  // Use replace so the user can't navigate back to the protected page
  if (!window.location.pathname.includes('/login')) {
    window.location.replace('/login?session=expired');
  }
}

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
  const res   = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Auto-logout on expired / invalid token
  if (res.status === 401) {
    handle401();
    throw new Error('Session expired. Please log in again.');
  }

  return res;
};

/** GET — returns parsed JSON or throws with message */
export const adminGet = async (endpoint) => {
  const res = await adminFetch(endpoint);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

/** POST */
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

/** PUT */
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

/** PATCH */
export const adminPatch = async (endpoint, body) => {
  const res = await adminFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
};

/** DELETE */
export const adminDelete = async (endpoint) => {
  const res = await adminFetch(endpoint, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json().catch(() => ({ success: true }));
};

/** Upload a file — sends multipart/form-data, returns { url: string } */
export const adminUpload = async (file) => {
  const token = localStorage.getItem('token');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: form,
  });
  if (res.status === 401) {
    ['token','userRole','userName','userEmail'].forEach(k => localStorage.removeItem(k));
    window.location.replace('/login?session=expired');
    throw new Error('Session expired');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed ${res.status}`);
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
