# Task Manager

Ein einfacher Full-Stack Task Manager, erstellt mit React, Node.js und Express.

## Funktionen

- Tasks erstellen
- Tasks anzeigen
- Tasks als erledigt markieren
- Tasks bearbeiten
- Tasks löschen
- Lokale Speicherung der Tasks

## Technologien

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- CORS

### Datenspeicherung

- JSON-Datei (`tasks.json`)

## Projektstruktur

```text
task-manager/
├── backend/
│   ├── server.js
│   └── tasks.json
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
└── README.md
```

## Anwendung starten

### 1. Backend starten

```bash
cd backend
node server.js
```

Das Backend läuft auf:

```text
http://localhost:3000
```

### 2. Frontend starten

In einem zweiten Terminal:

```bash
cd frontend
npm run dev
```

Das Frontend läuft normalerweise auf:

```text
http://localhost:5173
```

## API

| Methode | Route        | Funktion             |
| ------- | ------------ | -------------------- |
| GET     | `/tasks`     | Alle Tasks laden     |
| POST    | `/tasks`     | Neuen Task erstellen |
| PUT     | `/tasks/:id` | Task bearbeiten      |
| DELETE  | `/tasks/:id` | Task löschen         |

## Architektur

```text
React Frontend
      |
      | HTTP / JSON
      v
Express Backend
      |
      v
tasks.json
```

## Zweck des Projekts

Dieses Projekt wurde als Lern- und Testprojekt erstellt, um grundlegende Full-Stack-Webentwicklung zu üben.

Dabei werden unter anderem folgende Konzepte verwendet:

- React
- REST APIs
- HTTP Requests
- CRUD-Operationen
- Node.js
- Express
- JSON
- Frontend-Backend-Kommunikation
