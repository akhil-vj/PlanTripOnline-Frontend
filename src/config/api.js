export const API_BASE_URL = 'http://backend.plantriponline.com';

/**
 * A common function for making API requests to the backend.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/api/login')
 * @param {object} options - Fetch options like method, headers, body, etc.
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  return await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
};
