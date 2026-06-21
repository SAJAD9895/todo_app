import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
  if (isTomorrow(d)) return `Tomorrow at ${format(d, 'h:mm a')}`;
  return format(d, 'MMM d, yyyy');
};

export const formatRelative = (date) => {
  if (!date) return null;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return isPast(new Date(dueDate));
};

export const getPriorityWeight = (priority) => {
  const weights = { high: 3, medium: 2, low: 1 };
  return weights[priority] || 0;
};

export const truncate = (str, max = 100) => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}...` : str;
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const formatInputDate = (date) => {
  if (!date) return '';
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
};
