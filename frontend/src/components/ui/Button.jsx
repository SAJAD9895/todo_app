import clsx from 'clsx';
import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(variants[variant], sizes[size], className)}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
