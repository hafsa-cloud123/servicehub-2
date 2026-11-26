import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useFlash from '../hooks/useFlash.js';
import { getCategories, getCities, getServices } from '../services/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import ServiceFilters from '../components/ServiceFilters.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

const FILTER_KEYS = ['search', 'category', 'city', 'minPrice', 'maxPrice', 'sort'];

export default function Services() {
  // The filters live in the URL (?city=Lahore&page=2), so a page can be refreshed or shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const [flash, setFlash] = useFlash();

  const queryString = searchParams.toString();
  // useMemo keeps the same object until the URL changes. Without it, the filter form would
  // be reset on every re-render (for example when the category list finishes loading).
  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || (k === 'sort' ? 'newest' : '')])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryString]
  );
  const page = Number(searchParams.get('page')) || 1;

  const categories = useFetch(getCategories);
  const cities = useFetch(getCities);
  const { data, loading, error, reload } = useFetch(() => getServices({ ...filters, page, limit: 9 }), [queryString]);

  const apply = (next) => {
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((k) => {
      if (next[k] && !(k === 'sort' && next[k] === 'newest')) params.set(k, next[k]);
    });
    setSearchParams(params); // page goes back to 1
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="page-head">
        <h1>Services</h1>
        <Link to="/services/new" className="btn btn-primary">Add service</Link>
      </div>

      {flash && <Alert type={flash.type} onClose={() => setFlash(null)}>{flash.text}</Alert>}

      <ServiceFilters
        values={filters}
        categories={categories.data?.data}
        cities={cities.data?.data}
        onApply={apply}
        onReset={() => setSearchParams({})}
      />

      {loading && <Loader label="Loading services…" />}
      {error && <Alert type="error" onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <p className="muted result-count">
            {data.pagination.total} {data.pagination.total === 1 ? 'service' : 'services'} found
          </p>
          {data.data.length === 0 ? (
            <div className="empty">
              <h3>No services match these filters</h3>
              <p>Try a different search, or clear the filters to see everything.</p>
              <button type="button" className="btn" onClick={() => setSearchParams({})}>Clear filters</button>
            </div>
          ) : (
            <div className="grid">
              {data.data.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
          <Pagination page={data.pagination.page} pages={data.pagination.pages} onChange={goToPage} />
        </>
      )}
    </>
  );
}
