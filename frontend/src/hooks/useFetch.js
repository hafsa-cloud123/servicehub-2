import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api.js';

// Loads data from the API and keeps track of three things: the data, loading and error.
// Usage:  const { data, loading, error, reload } = useFetch(() => getServices(params), [paramsKey]);
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore the answer if the page changed before it arrived
    setState((s) => ({ ...s, loading: true, error: '' }));

    fetcher()
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: getErrorMessage(err) }));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);
  return { ...state, reload };
}
