import { useState } from 'react';
import { getCategories, getErrorMessage, getFieldErrors } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import Alert from './Alert.jsx';
import Loader from './Loader.jsx';
import { DAYS } from '../utils/format.js';

const EMPTY = {
  title: '',
  category: '',
  description: '',
  price: '',
  durationMinutes: 60,
  city: '',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  startTime: '09:00',
  endTime: '17:00',
};

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// Checks the form before sending it to the server (the server checks again).
const validate = (v) => {
  const e = {};
  if (v.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
  if (!v.category) e.category = 'Please choose a category';
  if (v.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
  if (v.price === '' || Number(v.price) < 0) e.price = 'Enter a price of 0 or more';
  if (!v.durationMinutes || Number(v.durationMinutes) < 15) e.durationMinutes = 'Duration must be at least 15 minutes';
  if (!v.city.trim()) e.city = 'City is required';
  if (v.workingDays.length === 0) e.workingDays = 'Select at least one working day';
  if (!v.startTime) e.startTime = 'Start time is required';
  if (!v.endTime) e.endTime = 'End time is required';
  if (v.startTime && v.endTime) {
    const window = toMinutes(v.endTime) - toMinutes(v.startTime);
    if (window <= 0) e.endTime = 'End time must be after start time';
    else if (Number(v.durationMinutes) > window) e.durationMinutes = 'Duration is longer than the working hours';
  }
  return e;
};

// Props:
//   initialValues - existing service (edit) or nothing (add)
//   onSubmit(payload) - async function that talks to the API
//   submitLabel - text of the button
export default function ServiceForm({ initialValues, onSubmit, submitLabel }) {
  const { data: catData, loading: catLoading, error: catError, reload } = useFetch(getCategories);
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear the error while typing
  };

  const toggleDay = (day) => {
    setValues((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day) ? prev.workingDays.filter((d) => d !== day) : [...prev.workingDays, day],
    }));
    setErrors((prev) => ({ ...prev, workingDays: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        price: Number(values.price),
        durationMinutes: Number(values.durationMinutes),
        city: values.city.trim(),
        workingDays: values.workingDays,
        startTime: values.startTime,
        endTime: values.endTime,
      });
    } catch (err) {
      // show the server's message and any field-level errors it sent
      setFormError(getErrorMessage(err));
      setErrors((prev) => ({ ...prev, ...getFieldErrors(err) }));
      setSubmitting(false);
    }
  };

  if (catLoading) return <Loader label="Loading form…" />;
  if (catError) return <Alert type="error" onRetry={reload}>{catError}</Alert>;

  const fieldError = (name) => errors[name] && <p className="field-error">{errors[name]}</p>;

  return (
    <form className="form" onSubmit={submit} noValidate>
      {formError && <Alert type="error">{formError}</Alert>}

      <div className="field">
        <label htmlFor="title">Service title</label>
        <input id="title" name="title" value={values.title} onChange={change} placeholder="e.g. House wiring and switch repair" aria-invalid={!!errors.title} />
        {fieldError('title')}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={change} aria-invalid={!!errors.category}>
            <option value="">Choose a category</option>
            {catData.data.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {fieldError('category')}
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" value={values.city} onChange={change} placeholder="e.g. Lahore" aria-invalid={!!errors.city} />
          {fieldError('city')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={values.description} onChange={change} placeholder="What is included, and what should the customer expect?" aria-invalid={!!errors.description} />
        {fieldError('description')}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="price">Price (Rs)</label>
          <input id="price" name="price" type="number" min="0" value={values.price} onChange={change} aria-invalid={!!errors.price} />
          {fieldError('price')}
        </div>
        <div className="field">
          <label htmlFor="durationMinutes">Duration (minutes)</label>
          <input id="durationMinutes" name="durationMinutes" type="number" min="15" step="15" value={values.durationMinutes} onChange={change} aria-invalid={!!errors.durationMinutes} />
          {fieldError('durationMinutes')}
        </div>
      </div>

      <fieldset className="field">
        <legend>Working days</legend>
        <div className="day-picker">
          {DAYS.map((d) => (
            <label key={d} className={`day ${values.workingDays.includes(d) ? 'on' : ''}`}>
              <input type="checkbox" checked={values.workingDays.includes(d)} onChange={() => toggleDay(d)} />
              {d}
            </label>
          ))}
        </div>
        {fieldError('workingDays')}
      </fieldset>

      <div className="form-row">
        <div className="field">
          <label htmlFor="startTime">Start time</label>
          <input id="startTime" name="startTime" type="time" value={values.startTime} onChange={change} aria-invalid={!!errors.startTime} />
          {fieldError('startTime')}
        </div>
        <div className="field">
          <label htmlFor="endTime">End time</label>
          <input id="endTime" name="endTime" type="time" value={values.endTime} onChange={change} aria-invalid={!!errors.endTime} />
          {fieldError('endTime')}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
