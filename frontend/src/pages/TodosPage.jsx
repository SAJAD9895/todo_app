import { useState, useEffect, useCallback } from 'react';
import { useTodos } from '../context/TodoContext';
import { useNotifications } from '../hooks/useNotifications';
import TodoFilters from '../components/todos/TodoFilters';
import TodoList from '../components/todos/TodoList';
import TodoForm from '../components/todos/TodoForm';
import BulkActions from '../components/todos/BulkActions';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';

export default function TodosPage() {
  const {
    todos, pagination, loading, filters, selectedIds,
    viewMode, setViewMode, fetchTodos, updateFilters, createTodo, updateTodo, resetFilters,
  } = useTodos();
  const { requestPermission } = useNotifications();

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const load = useCallback(() => {
    fetchTodos(filters);
  }, [fetchTodos, filters]);

  useEffect(() => {
    load();
    requestPermission();
  }, [filters, load, requestPermission]);

  const handleCreate = async (data) => {
    await createTodo(data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateTodo(editingTodo.id, data);
    setEditingTodo(null);
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.category;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {pagination?.total ?? 0} task{pagination?.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              aria-label="Card view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <Button
            onClick={() => setShowForm(true)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TodoFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        hasActive={!!hasActiveFilters}
      />

      {/* Bulk actions */}
      {selectedIds.length > 0 && <BulkActions />}

      {/* Todos list */}
      {todos.length === 0 && !loading ? (
        <EmptyState
          title={hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
          description={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Create your first task to get started!'}
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={resetFilters}>Clear Filters</Button>
            ) : (
              <Button onClick={() => setShowForm(true)}>Create Task</Button>
            )
          }
        />
      ) : (
        <TodoList
          todos={todos}
          loading={loading}
          viewMode={viewMode}
          onEdit={setEditingTodo}
        />
      )}

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => updateFilters({ page })}
      />

      {/* Create modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Create New Task"
        size="lg"
      >
        <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="Edit Task"
        size="lg"
      >
        {editingTodo && (
          <TodoForm
            initialData={editingTodo}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTodo(null)}
          />
        )}
      </Modal>
    </div>
  );
}
