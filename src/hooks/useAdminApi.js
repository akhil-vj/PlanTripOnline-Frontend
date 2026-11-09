import { useState, useEffect, useCallback, useRef } from 'react';
import { adminGet } from '../config/api';

/**
 * useAdminApi — generic hook for single admin GET requests.
 *
 * @param {string|null} endpoint  — API path; pass null to skip.
 * @param {any}         deps      — Extra value to trigger re-fetch.
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

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * useAdminList — paginated list hook with server-side filters.
 *
 * Usage:
 *   const { data, loading, error, refetch } =
 *     useAdminList('/api/admin/bookings', { status: '', per_page: 15 });
 *
 * Blank / null / undefined filter values are stripped before building the
 * query string so the backend never receives empty params.
 */
export function useAdminList(endpoint, defaultFilters = {}) {
  const [filters, setFilters] = useState(defaultFilters);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v != null)
      );
      const qs = new URLSearchParams(cleanFilters).toString();
      const url = qs ? `${endpoint}?${qs}` : endpoint;
      const json = await adminGet(url);
      if (!controller.signal.aborted) setData(json);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [endpoint, filters]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, filters, setFilters };
}
