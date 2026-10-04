import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:3000";

  async function loadTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (title.trim() === "") {
      return;
    }

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    setTitle("");
    loadTasks();
  }

  async function toggleTask(task) {
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    loadTasks();
  }

  async function editTask(id, newTitle) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });

    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    loadTasks();
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Neue Aufgabe..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit">Hinzufügen</button>
      </form>

      <div>
        {tasks.map((task) => (
          <div key={task.id}>
            <span onClick={() => toggleTask(task)}>
              {task.completed ? "✅" : "⬜"} {task.title}
            </span>

            <button
              onClick={() => {
                const newTitle = prompt("Neuer Task-Name:", task.title);

                if (newTitle && newTitle.trim() !== "") {
                  editTask(task.id, newTitle);
                }
              }}
            >
              Bearbeiten
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;