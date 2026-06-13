import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit, filter }) {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    if (filter === 'high') return todo.priority === 'high';
    if (filter === 'medium') return todo.priority === 'medium';
    if (filter === 'low') return todo.priority === 'low';
    return true;
  });

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-4xl mb-4">📝</p>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Add a task above to get started!</p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks match this filter</h3>
        <p className="text-gray-600">Try selecting a different filter</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Tasks ({filteredTodos.length}/{todos.length})
      </h2>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
