import { useMemo, useState } from 'react';
import { TreeMap } from 'data-structure-typed';

type TodoItem = {
  id: number;
  title: string;
};

export default function TodoList() {
  const [todoOrdered, setTodoOrdered] = useState(
    () =>
      new TreeMap<number, TodoItem, TodoItem>(
        [
          { id: 100, title: 'title 100' },
          { id: 1, title: 'title 1' },
        ],
        { toEntryFn: (item) => [item.id, item] }
      )
  );

  // Derive a stable sorted list for rendering
  const todos = useMemo(() => [...todoOrdered.values()], [todoOrdered]);

  const addTodo = () => {
    setTodoOrdered((prev) => {
      const next = prev.clone();

      // Pick a non-conflicting id (simple demo approach)
      let id = Math.floor(Math.random() * 100);
      while (next.has(id)) id = Math.floor(Math.random() * 100);

      next.set(id, { id, title: `title ${id}` });
      return next;
    });
  };

  const deleteTodo = (id: number) => {
    setTodoOrdered((prev) => {
      const next = prev.clone();
      next.delete(id);
      return next;
    });
  };

  return (
    <div>
      <h2>Todo List (sorted by id)</h2>
      <button onClick={addTodo}>Add Todo</button>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {todos.map((todo) => (
          <li
            key={todo?.id}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              padding: '8px 0',
            }}
          >
            <strong style={{ flex: 1 }}>{todo?.title}</strong>
            <span style={{ width: 80, textAlign: 'right' }}>
              ID: {todo?.id}
            </span>
            <button onClick={() => deleteTodo(todo?.id ?? 0)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
