import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { createCategory, deleteCategory, getCategories, getErrorMessage, getFieldErrors, updateCategory } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

export default function Categories() {
  const { data, loading, error, reload } = useFetch(getCategories);
  const [message, setMessage] = useState(null); // { type, text }

  // add form
  const [form, setForm] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [adding, setAdding] = useState(false);

  // inline edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [savingId, setSavingId] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (form.name.trim().length < 2) {
      setFormErrors({ name: 'Name must be at least 2 characters' });
      return;
    }
    setAdding(true);
    try {
      await createCategory({ name: form.name.trim(), description: form.description.trim() });
      setForm({ name: '', description: '' });
      setFormErrors({});
      setMessage({ type: 'success', text: 'Category created' });
      reload();
    } catch (err) {
      setFormErrors(getFieldErrors(err));
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ name: c.name, description: c.description || '' });
    setMessage(null);
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    try {
      await updateCategory(id, { name: editForm.name.trim(), description: editForm.description.trim() });
      setEditingId(null);
      setMessage({ type: 'success', text: 'Category updated' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete the category "${c.name}"?`)) return;
    try {
      await deleteCategory(c._id);
      setMessage({ type: 'success', text: 'Category deleted' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Categories</h1>
      </div>

      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}

      <form className="inline-form card" onSubmit={add} noValidate>
        <div className="field">
          <label htmlFor="cat-name">New category</label>
          <input id="cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gardener" aria-invalid={!!formErrors.name} />
          {formErrors.name && <p className="field-error">{formErrors.name}</p>}
        </div>
        <div className="field grow">
          <label htmlFor="cat-desc">Description (optional)</label>
          <input id="cat-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A short line about this category" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding…' : 'Add category'}</button>
      </form>

      {loading && <Loader label="Loading categories…" />}
      {error && <Alert type="error" onRetry={reload}>{error}</Alert>}

      {data && data.data.length === 0 && (
        <div className="empty">
          <h3>No categories yet</h3>
          <p>Add your first category above. Services are grouped by category.</p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <ul className="list">
          {data.data.map((c) => (
            <li key={c._id} className="list-row">
              {editingId === c._id ? (
                <div className="edit-row">
                  <input aria-label="Category name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  <input aria-label="Category description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  <button type="button" className="btn btn-primary btn-small" onClick={() => saveEdit(c._id)} disabled={savingId === c._id}>
                    {savingId === c._id ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div>
                    <strong>{c.name}</strong>
                    <span className="muted"> · {c.serviceCount} {c.serviceCount === 1 ? 'service' : 'services'}</span>
                    {c.description && <p className="muted">{c.description}</p>}
                  </div>
                  <div className="row-actions">
                    <button type="button" className="btn btn-small" onClick={() => startEdit(c)}>Edit</button>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => remove(c)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
