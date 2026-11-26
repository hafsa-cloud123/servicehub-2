import axios from 'axios';

// One shared Axios instance. Every request starts with this base URL (from .env).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// ---------- error helpers ----------
// A readable message for any failed request.
export const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (err.request) return 'Cannot reach the server. Check that the backend is running.';
  return err.message || 'Something went wrong.';
};

// Turns the backend validation list [{field, message}] into { field: message } for forms.
export const getFieldErrors = (err) => {
  const list = err.response?.data?.errors;
  return Array.isArray(list) ? Object.fromEntries(list.map((e) => [e.field, e.message])) : {};
};

// Removes empty filter values so they are not sent as "?city=&search=".
const clean = (params = {}) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));

// ---------- services ----------
export const getServices = (params) => api.get('/services', { params: clean(params) }).then((r) => r.data);
export const getCities = () => api.get('/services/cities').then((r) => r.data);
export const getService = (id) => api.get(`/services/${id}`).then((r) => r.data);
export const createService = (data) => api.post('/services', data).then((r) => r.data);
export const updateService = (id, data) => api.put(`/services/${id}`, data).then((r) => r.data);
export const deleteService = (id) => api.delete(`/services/${id}`).then((r) => r.data);

// ---------- categories ----------
export const getCategories = () => api.get('/categories').then((r) => r.data);
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

export default api;
