import { useState, useEffect, useCallback } from 'react';
import { adminGet } from '../config/api';

/**
 * useAdminApi — generic hook for admin authenticated GET requests.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAdminApi('/api/admin/dashboard/stats');
 *
 * @param {string|null} endpoint  — API path. Pass null to skip initial fetch.
 * @param {any}         deps      — Extra dependency to trigger re-fetch (optional).
 */
export function useAdminApi(endpoint, deps = null) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(!!endpoint);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const json = await adminGet(endpoint);
      setData(json);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * useAdminList — paginated list hook with filters.
 *
 * Usage:
 *   const { data, loading, error, refetch, setFilters } =
 *     useAdminList('/api/admin/bookings', { status: '', per_page: 15 });
 */
export function useAdminList(endpoint, defaultFilters = {}) {
  const [filters,  setFilters]  = useState(defaultFilters);
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v != null))
      ).toString();
      const url = query ? `${endpoint}?${query}` : endpoint;
      const json = await adminGet(url);
      setData(json);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData, filters, setFilters };
}
