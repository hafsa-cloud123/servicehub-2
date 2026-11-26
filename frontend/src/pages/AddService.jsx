import { Link, useNavigate } from 'react-router-dom';
import ServiceForm from '../components/ServiceForm.jsx';
import { createService } from '../services/api.js';

export default function AddService() {
  const navigate = useNavigate();

  // Flow: form -> createService() -> POST /api/services -> controller -> MongoDB -> back here
  const handleCreate = async (payload) => {
    const res = await createService(payload);
    navigate(`/services/${res.data._id}`, { state: { flash: { type: 'success', text: 'Service created' } } });
  };

  return (
    <>
      <p><Link to="/services">← All services</Link></p>
      <h1>Add a service</h1>
      <ServiceForm onSubmit={handleCreate} submitLabel="Create service" />
    </>
  );
}
