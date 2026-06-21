import clsx from 'clsx';

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          id={inputId}
          className={clsx(
            'input',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}
