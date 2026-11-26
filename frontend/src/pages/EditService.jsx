import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import ServiceForm from '../components/ServiceForm.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import { getService, updateService } from '../services/api.js';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(() => getService(id), [id]);

  const handleUpdate = async (payload) => {
    await updateService(id, payload);
    navigate(`/services/${id}`, { state: { flash: { type: 'success', text: 'Service updated' } } });
  };

  if (loading) return <Loader label="Loading service…" />;
  if (error) return <Alert type="error" onRetry={reload}>{error}</Alert>;

  const s = data.data;
  // The API sends category as an object; the form needs just its id.
  const initialValues = { ...s, category: s.category?._id };

  return (
    <>
      <p><Link to={`/services/${id}`}>← Back to service</Link></p>
      <h1>Edit service</h1>
      <ServiceForm initialValues={initialValues} onSubmit={handleUpdate} submitLabel="Save changes" />
    </>
  );
}
