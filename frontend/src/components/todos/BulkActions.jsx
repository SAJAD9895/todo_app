import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function BulkActions() {
  const { selectedIds, bulkDelete, clearSelection, selectAll, todos } = useTodos();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      await bulkDelete(selectedIds);
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          {selectedIds.length} task{selectedIds.length !== 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-2 ml-auto">
          {selectedIds.length < todos.length && (
            <button onClick={selectAll} className="text-sm text-primary-600 hover:underline">
              Select all
            </button>
          )}
          <button onClick={clearSelection} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Clear
          </button>
          <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
            Delete Selected
          </Button>
        </div>
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Tasks"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleBulkDelete}>
              Delete {selectedIds.length} Task{selectedIds.length !== 1 ? 's' : ''}
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>{selectedIds.length}</strong> task{selectedIds.length !== 1 ? 's' : ''}?
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
