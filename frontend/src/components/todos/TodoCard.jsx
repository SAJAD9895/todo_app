import { useState } from 'react';
import clsx from 'clsx';
import { useTodos } from '../../context/TodoContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatDate, isOverdue, truncate } from '../../utils/helpers';

export default function TodoCard({ todo, onEdit }) {
  const { toggleComplete, deleteTodo, toggleSelect, selectedIds } = useTodos();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSelected = selectedIds.includes(todo.id);
  const overdue = isOverdue(todo.dueDate, todo.status);
  const isCompleted = todo.status === 'completed';

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteTodo(todo.id); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className={clsx(
        'card p-4 hover:shadow-md transition-all animate-scale-in flex flex-col gap-3',
        isSelected && 'ring-2 ring-primary-500',
        isCompleted && 'opacity-70'
      )}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(todo.id)}
              className="w-4 h-4 rounded text-primary-600 border-gray-300"
            />
            <button
              onClick={() => toggleComplete(todo.id)}
              className={clsx(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
              )}
            >
              {isCompleted && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(todo)}
              className="p-1 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className={clsx(
            'font-semibold text-sm leading-snug',
            isCompleted ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
          )}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {truncate(todo.description, 80)}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <PriorityBadge priority={todo.priority} />
          <StatusBadge status={todo.status} />
          {todo.category && (
            <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {todo.category}
            </span>
          )}
        </div>

        {/* Due date */}
        {todo.dueDate && (
          <p className={clsx('text-xs flex items-center gap-1', overdue ? 'text-red-500' : 'text-gray-400')}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {overdue ? 'Overdue · ' : ''}{formatDate(todo.dueDate)}
          </p>
        )}
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Task"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>"{todo.title}"</strong>?
        </p>
      </Modal>
    </>
  );
}
