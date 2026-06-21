import { useState } from 'react';
import clsx from 'clsx';
import { useTodos } from '../../context/TodoContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatDate, isOverdue, truncate } from '../../utils/helpers';

export default function TodoItem({ todo, onEdit }) {
  const { toggleComplete, deleteTodo, toggleSelect, selectedIds } = useTodos();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isSelected = selectedIds.includes(todo.id);
  const overdue = isOverdue(todo.dueDate, todo.status);
  const isCompleted = todo.status === 'completed';

  const handleToggle = async () => {
    setCompleting(true);
    try { await toggleComplete(todo.id); }
    finally { setCompleting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteTodo(todo.id); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className={clsx(
        'flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group animate-slide-in',
        isSelected && 'bg-primary-50 dark:bg-primary-900/10'
      )}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(todo.id)}
          className="mt-1 w-4 h-4 rounded text-primary-600 border-gray-300 dark:border-gray-600 cursor-pointer"
        />

        {/* Complete button */}
        <button
          onClick={handleToggle}
          disabled={completing}
          className={clsx(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
            isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          )}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={clsx(
              'font-medium text-sm',
              isCompleted ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
            )}>
              {todo.title}
            </span>
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />
            {todo.category && (
              <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {todo.category}
              </span>
            )}
          </div>

          {todo.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {truncate(todo.description, 120)}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-1.5">
            {todo.dueDate && (
              <span className={clsx('text-xs flex items-center gap-1', overdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500')}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {overdue ? 'Overdue · ' : ''}{formatDate(todo.dueDate)}
              </span>
            )}
            {todo.reminderTime && (
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {formatDate(todo.reminderTime)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
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
          Are you sure you want to delete <strong>"{todo.title}"</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
