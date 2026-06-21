import clsx from 'clsx';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';

export function PriorityBadge({ priority }) {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  return (
    <span className={clsx('badge', colors.bg, colors.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5 inline-block', colors.dot)} />
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const labels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
  return (
    <span className={clsx('badge', colors.bg, colors.text)}>
      {labels[status] || status}
    </span>
  );
}
