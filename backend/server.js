const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const tasksFile = path.join(__dirname, "tasks.json");

function readTasks() {
  try {
    const data = fs.readFileSync(tasksFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Startseite
app.get("/", (req, res) => {
  res.send("Task Manager Backend läuft!");
});

// Alle Tasks laden
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Neuen Task erstellen
app.post("/tasks", (req, res) => {
  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks(tasks);

  res.status(201).json(newTask);
});

// Task bearbeiten oder Status ändern
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();

  const taskId = Number(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task nicht gefunden",
    });
  }

  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  if (req.body.title !== undefined) {
    task.title = req.body.title;
  }

  saveTasks(tasks);

  res.json(task);
});

// Task löschen
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();

  const taskId = Number(req.params.id);

  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasks(tasks);

  res.json({
    message: "Task gelöscht",
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});