import { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodoStatus,
  deleteTodo,
  updateTodo, 
} from "../api/todoApi";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [openTaskId, setOpenTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data);
    } catch {
      setError("Unable to fetch todos");
    } finally {
      setLoading(false);
    }
  };


  const handleAdd = async () => {
    if (!title.trim()) return;

    const newTask = {
      title,
      date: new Date().toISOString(),
      status: "pending",
    };

    try {
      await createTodo(newTask);
      setTitle("");
      fetchTodos();
    } catch {
      setError("Failed to add task");
    }
  };

  const toggleDetails = (todo) => {
    setOpenTaskId(openTaskId === todo.id ? null : todo.id);
    setEditTitle(todo.title);
  };

 
  const handleUpdateTitle = async (id) => {
    try {
      await updateTodo(id, { title: editTitle });
      fetchTodos();
      setOpenTaskId(null);
    } catch {
      setError("Failed to update task");
    }
  };


  const handleStatusChange = async (id, status) => {
    try {
      await updateTodoStatus(id, status);
      fetchTodos();
    } catch {
      setError("failed to update status");
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch {
      setError("failed to delete task");
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="todo-container">
   
      <div className="add-box">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

   
      <input
        className="search"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

    
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div onClick={() => toggleDetails(todo)}>
              <span className={todo.status === "complete" ? "completed" : ""}>
                {todo.title}
              </span>
            </div>

            <span
              className="delete-icon"
              onClick={() => handleDelete(todo.id)}
            >
              🗑️
            </span>

     
            {openTaskId === todo.id && (
              <div className="task-details">
                <p>📅 {new Date(todo.date).toLocaleString()}</p>

          
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleUpdateTitle(todo.id)}>
                  Update Task
                </button>

                {/* STATUS */}
                <p>📌 Status: {todo.status}</p>
                <select
                  value={todo.status}
                  onChange={(e) =>
                    handleStatusChange(todo._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
