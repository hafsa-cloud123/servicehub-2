import { Link } from 'react-router-dom';
import { formatPrice, formatDuration } from '../utils/format.js';

// Props: one service object from the API
export default function ServiceCard({ service }) {
  const { _id, title, category, provider, city, price, durationMinutes, averageRating, reviewCount } = service;
  return (
    <Link to={`/services/${_id}`} className="card service-card">
      <span className="tag">{category?.name || 'Uncategorised'}</span>
      <h3>{title}</h3>
      <p className="muted">
        {provider?.name} · {city}
      </p>
      <div className="card-foot">
        <span className="price">{formatPrice(price)}</span>
        <span className="muted">
          {formatDuration(durationMinutes)} · {reviewCount > 0 ? `★ ${averageRating.toFixed(1)} (${reviewCount})` : 'New'}
        </span>
      </div>
    </Link>
  );
}
