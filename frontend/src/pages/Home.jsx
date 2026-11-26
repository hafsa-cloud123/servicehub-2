import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getCities, getServices } from '../services/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const categories = useFetch(getCategories);
  const cities = useFetch(getCities);
  const latest = useFetch(() => getServices({ limit: 6 }));

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (city) params.set('city', city);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <h1>Book a trusted local pro at a time that suits you</h1>
        <p className="lead">Electricians, plumbers, tutors and more. Compare prices, check working hours and find help near you.</p>
        <form className="hero-search" onSubmit={submit}>
          <div className="field grow">
            <label htmlFor="h-search">What do you need?</label>
            <input id="h-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="AC repair, maths tutor, wiring…" />
          </div>
          <div className="field">
            <label htmlFor="h-city">City</label>
            <select id="h-city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Any city</option>
              {cities.data?.data.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-accent btn-large">Find services</button>
        </form>
      </section>

      <section className="section">
        <h2>Browse by category</h2>
        {categories.loading && <Loader />}
        {categories.error && <Alert type="error" onRetry={categories.reload}>{categories.error}</Alert>}
        {categories.data && (
          <div className="chips">
            {categories.data.data.map((c) => (
              <Link key={c._id} to={`/services?category=${c._id}`} className="chip">
                {c.name} <span className="chip-count">{c.serviceCount}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Newly added services</h2>
          <Link to="/services">See all services</Link>
        </div>
        {latest.loading && <Loader label="Loading services…" />}
        {latest.error && <Alert type="error" onRetry={latest.reload}>{latest.error}</Alert>}
        {latest.data && latest.data.data.length === 0 && <p className="muted">No services yet. Be the first to add one.</p>}
        {latest.data && (
          <div className="grid">
            {latest.data.data.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
