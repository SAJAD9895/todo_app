import TodoItem from './TodoItem';
import TodoCard from './TodoCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function TodoList({ todos, loading, viewMode, onEdit }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (viewMode === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onEdit={onEdit} />
        ))}
      </div>
    );
  }

  return (
    <div className="card divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
      ))}
    </div>
  );
}
