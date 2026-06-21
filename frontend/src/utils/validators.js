export const validators = {
  required: (value) => {
    if (!value || String(value).trim() === '') return 'This field is required';
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Please enter a valid email address';
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) return `Must be at least ${min} characters`;
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) return `Must not exceed ${max} characters`;
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must contain at least one lowercase letter';
    if (!/\d/.test(value)) return 'Must contain at least one number';
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },

  compose:
    (...fns) =>
    (value) => {
      for (const fn of fns) {
        const error = fn(value);
        if (error) return error;
      }
      return null;
    },
};
