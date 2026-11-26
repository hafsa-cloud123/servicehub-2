import { useEffect, useState } from 'react';

// Controlled filter form. The page keeps the "real" filters in the URL;
// this component keeps what the user is typing until they press Apply.
export default function ServiceFilters({ values, categories = [], cities = [], onApply, onReset }) {
  const [local, setLocal] = useState(values);

  // when the URL changes (for example on Reset), update the form
  useEffect(() => setLocal(values), [values]);

  const change = (e) => setLocal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    onApply(local);
  };

  return (
    <form className="filters" onSubmit={submit}>
      <div className="field grow">
        <label htmlFor="f-search">Search</label>
        <input id="f-search" name="search" value={local.search} onChange={change} placeholder="Wiring, tutor, AC…" />
      </div>
      <div className="field">
        <label htmlFor="f-category">Category</label>
        <select id="f-category" name="category" value={local.category} onChange={change}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-city">City</label>
        <select id="f-city" name="city" value={local.city} onChange={change}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="field narrow">
        <label htmlFor="f-min">Min price</label>
        <input id="f-min" name="minPrice" type="number" min="0" value={local.minPrice} onChange={change} />
      </div>
      <div className="field narrow">
        <label htmlFor="f-max">Max price</label>
        <input id="f-max" name="maxPrice" type="number" min="0" value={local.maxPrice} onChange={change} />
      </div>
      <div className="field">
        <label htmlFor="f-sort">Sort by</label>
        <select id="f-sort" name="sort" value={local.sort} onChange={change}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <div className="filter-actions">
        <button type="submit" className="btn btn-primary">Apply</button>
        <button type="button" className="btn" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}
