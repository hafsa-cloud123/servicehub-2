import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useFlash from '../hooks/useFlash.js';
import { deleteService, getErrorMessage, getService } from '../services/api.js';
import { formatDays, formatDuration, formatPrice, formatTime } from '../utils/format.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flash, setFlash] = useFlash();
  const { data, loading, error, reload } = useFetch(() => getService(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteService(id);
      navigate('/services', { state: { flash: { type: 'success', text: 'Service deleted' } } });
    } catch (err) {
      setDeleteError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading service…" />;
  if (error) {
    return (
      <>
        <Alert type="error" onRetry={reload}>{error}</Alert>
        <Link to="/services">Back to services</Link>
      </>
    );
  }

  const s = data.data;
  return (
    <>
      <p><Link to="/services">← All services</Link></p>
      {flash && <Alert type={flash.type} onClose={() => setFlash(null)}>{flash.text}</Alert>}
      {deleteError && <Alert type="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      <div className="detail">
        <article>
          <span className="tag">{s.category?.name}</span>
          <h1>{s.title}</h1>
          <p className="muted">Offered by {s.provider?.name} in {s.city}</p>
          <p className="description">{s.description}</p>

          <dl className="facts">
            <div><dt>Price</dt><dd className="price">{formatPrice(s.price)}</dd></div>
            <div><dt>Duration</dt><dd>{formatDuration(s.durationMinutes)}</dd></div>
            <div><dt>Working days</dt><dd>{formatDays(s.workingDays)}</dd></div>
            <div><dt>Working hours</dt><dd>{formatTime(s.startTime)} to {formatTime(s.endTime)}</dd></div>
            <div><dt>Rating</dt><dd>{s.reviewCount > 0 ? `★ ${s.averageRating.toFixed(1)} (${s.reviewCount} reviews)` : 'No reviews yet'}</dd></div>
          </dl>
        </article>

        <aside className="card side">
          <h3>Manage this service</h3>
          <div className="stack">
            <Link to={`/services/${s._id}/edit`} className="btn btn-primary">Edit service</Link>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete service'}
            </button>
          </div>
          <hr />
          <h3>Booking</h3>
          <p className="muted">Online booking with time slots is added in the next stage of the project.</p>
        </aside>
      </div>
    </>
  );
}
