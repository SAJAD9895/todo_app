import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, CATEGORY_SUGGESTIONS } from '../../utils/constants';
import { formatInputDate } from '../../utils/helpers';

export default function TodoForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'pending',
    category: initialData?.category || '',
    dueDate: initialData?.dueDate ? formatInputDate(initialData.dueDate) : '',
    reminderTime: initialData?.reminderTime ? formatInputDate(initialData.reminderTime) : '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 255) errs.title = 'Title is too long';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || null,
        reminderTime: form.reminderTime || null,
        description: form.description || null,
        category: form.category || null,
      };
      await onSubmit(payload);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-400">
          {errors.general}
        </div>
      )}

      <Input
        label="Title"
        name="title"
        required
        placeholder="What needs to be done?"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        autoFocus
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Add details (optional)..."
          value={form.description}
          onChange={handleChange}
          className="input resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Priority */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input">
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input">
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input
          list="category-suggestions"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Work, Personal..."
          className="input"
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          name="dueDate"
          type="datetime-local"
          value={form.dueDate}
          onChange={handleChange}
        />
        <Input
          label="Reminder"
          name="reminderTime"
          type="datetime-local"
          value={form.reminderTime}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
