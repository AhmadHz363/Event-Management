
import { useState, useEffect } from 'react';
import {
  getEventCount,
  getEventStatus,
  getEventtrends,
  getPopularEvents,
} from '../API/Eventstatistics';

export function useEventCount() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventCount()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}


export function useEventStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventStatus()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}


export function useEventTrends(fromDate, toDate) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!(fromDate && toDate));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    getEventtrends(fromDate, toDate)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  return { data, loading, error };
}


export function usePopularEvents(limit = 5) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!limit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!limit) return;

    setLoading(true);
    getPopularEvents(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}
