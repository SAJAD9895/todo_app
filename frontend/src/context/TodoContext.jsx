import { createContext, useContext, useState, useCallback } from 'react';
import { todoService } from '../services/todoService';
import toast from 'react-hot-toast';

const TodoContext = createContext(null);

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  category: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  page: 1,
  limit: 10,
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('list');

  const fetchTodos = useCallback(async (customFilters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      // Remove empty params
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k];
      });
      const res = await todoService.getAll(params);
      setTodos(res.data);
      setPagination(res.pagination);
    } catch (error) {
      toast.error(error.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTodo = async (data) => {
    const res = await todoService.create(data);
    toast.success('Task created successfully!');
    await fetchTodos();
    return res.data;
  };

  const updateTodo = async (id, data) => {
    const res = await todoService.update(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    toast.success('Task updated!');
    return res.data;
  };

  const deleteTodo = async (id) => {
    await todoService.delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    toast.success('Task deleted');
  };

  const bulkDelete = async (ids) => {
    await todoService.bulkDelete(ids);
    setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
    setSelectedIds([]);
    toast.success(`${ids.length} task(s) deleted`);
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    return updateTodo(id, { status: newStatus });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(todos.map((t) => t.id));
  const clearSelection = () => setSelectedIds([]);

  return (
    <TodoContext.Provider value={{
      todos, pagination, loading, filters, selectedIds, viewMode,
      fetchTodos, createTodo, updateTodo, deleteTodo, bulkDelete,
      toggleComplete, updateFilters, resetFilters,
      toggleSelect, selectAll, clearSelection, setViewMode,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
};
