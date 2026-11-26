import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Shows a one-time message passed from another page, for example after creating a service:
//   navigate('/services/123', { state: { flash: { type: 'success', text: 'Service created' } } })
export default function useFlash() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      // clear it from history so a page refresh does not show it again
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return [flash, setFlash];
}
