import clsx from 'clsx';

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={clsx('border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin', sizes[size])} />
      {fullScreen && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
