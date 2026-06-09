import { useState, useEffect, useCallback, useRef } from "react";
import { ticketApi } from "../services/api";

/**
 * Hook that manages the tickets list with search, filter and pagination.
 */
export function useTickets({ status = "", search = "", page = 1, limit = 50 } = {}) {
  const [tickets, setTickets]   = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;
      const data = await ticketApi.list(params);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, search, page, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { tickets, total, loading, error, refresh: fetch };
}

/**
 * Hook that fetches a single ticket by ID.
 */
export function useTicket(ticketId) {
  const [ticket, setTicket]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ticketApi.get(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ticket, loading, error, refresh: fetch };
}

/**
 * Hook that fetches summary stats.
 */
export function useStats() {
  const [stats, setStats]     = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await ticketApi.stats();
      setStats(data);
    } catch (_) {
      // silently fail for stats
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, refresh: fetch };
}

/**
 * Debounce helper hook.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
