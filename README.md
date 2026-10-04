# Task Manager

A simple full-stack Task Manager application built with React, Node.js, and Express.

The project demonstrates basic CRUD operations, frontend-to-backend communication using a REST API, and distributed tracing with OpenTelemetry and Jaeger.

## Features

- Create tasks
- View tasks
- Mark tasks as completed
- Edit tasks
- Delete tasks
- Persist tasks locally in a JSON file
- OpenTelemetry tracing for the frontend and backend
- Distributed trace propagation between browser and backend
- Trace visualization with Jaeger

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- OpenTelemetry Web SDK

### Backend

- Node.js
- Express.js
- CORS
- OpenTelemetry Node.js Auto-Instrumentation

### Data Storage

- Local JSON file

### Observability

- OpenTelemetry
- OTLP over HTTP
- Jaeger
- Docker

---

## Architecture

```text
Browser
   |
   v
React Frontend
localhost:5173
   |
   | HTTP / JSON
   | W3C Trace Context
   v
Express Backend
localhost:3000
   |
   v
tasks.json
```

The observability architecture is:

```text
React Frontend
task-manager-frontend
        |
        | OTLP/HTTP
        v
     Jaeger
        ^
        | OTLP/HTTP
        |
Express Backend
task-manager-backend
```

OpenTelemetry propagates trace context between the frontend and backend using the standard `traceparent` HTTP header.

This makes it possible to follow a request from the browser through the backend as a distributed trace.

---

## Project Structure

```text
task-manager/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── server.js
│   ├── start-otel.ps1
│   ├── tasks.json
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   ├── main.jsx
    │   └── otel.js
    │
    ├── .env
    ├── package.json
    ├── package-lock.json
    └── index.html
```

---

# Installation

## Requirements

Make sure the following tools are installed:

- Node.js
- npm
- Git
- Docker Desktop

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Enter the project directory:

```bash
cd task-manager
```

---

# Backend Setup

Enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

The backend runs on:

```text
http://localhost:3000
```

Without OpenTelemetry, it can be started with:

```bash
node server.js
```

---

# Backend OpenTelemetry Instrumentation

The Node.js backend uses OpenTelemetry Zero-Code Instrumentation.

The application code in `server.js` does not contain OpenTelemetry instrumentation code.

Instead, OpenTelemetry is loaded before the Node.js application starts.

The relevant packages include:

```text
@opentelemetry/api
@opentelemetry/auto-instrumentations-node
```

The PowerShell script:

```text
backend/start-otel.ps1
```

configures OpenTelemetry using environment variables.

It defines:

```powershell
$env:OTEL_SERVICE_NAME="task-manager-backend"
$env:OTEL_TRACES_EXPORTER="otlp"
$env:OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
$env:NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"

node server.js
```

Start the instrumented backend with:

```powershell
.\start-otel.ps1
```

The backend appears in Jaeger as:

```text
task-manager-backend
```

OpenTelemetry automatically instruments supported Node.js libraries such as:

- HTTP
- Express

This allows incoming API requests to automatically produce spans.

---

# Frontend Setup

Open a second terminal and enter:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# Frontend OpenTelemetry Instrumentation

The React frontend uses the OpenTelemetry Web SDK.

Unlike Node.js auto-instrumentation, browser instrumentation requires a small OpenTelemetry bootstrap configuration.

The configuration is located in:

```text
frontend/src/otel.js
```

It configures:

- `WebTracerProvider`
- `BatchSpanProcessor`
- `OTLPTraceExporter`
- `ZoneContextManager`
- automatic web instrumentations
- Fetch instrumentation
- XMLHttpRequest instrumentation
- W3C trace-context propagation

The frontend appears in Jaeger as:

```text
task-manager-frontend
```

The frontend OpenTelemetry configuration is loaded before the React application in:

```text
frontend/src/main.jsx
```

using:

```javascript
import "./otel.js";
```

---

# Frontend OpenTelemetry Environment Variables

The frontend uses Vite environment variables.

Example:

```env
VITE_OTEL_SERVICE_NAME=task-manager-frontend
VITE_OTEL_EXPORTER_ENDPOINT=http://localhost:4318/v1/traces
```

These variables configure the service name and OTLP trace endpoint.

Important:

Variables beginning with `VITE_` are exposed to the browser.

Never store passwords, API keys, authentication tokens, or other secrets in `VITE_` environment variables.

---

# Jaeger

Jaeger is used to collect and visualize traces.

Start Jaeger using Docker:

```bash
docker run --rm --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 jaegertracing/all-in-one:latest --collector.otlp.http.cors.allowed-origins=http://localhost:5173 --collector.otlp.http.cors.allowed-headers=Content-Type
```

The relevant ports are:

| Port    | Purpose        |
| ------- | -------------- |
| `16686` | Jaeger Web UI  |
| `4317`  | OTLP over gRPC |
| `4318`  | OTLP over HTTP |

Open the Jaeger UI:

```text
http://localhost:16686
```

You should see two services:

```text
task-manager-frontend
task-manager-backend
```

---

# Distributed Tracing

When the frontend sends a request such as:

```text
POST /tasks
```

OpenTelemetry creates a frontend span.

The browser sends a W3C Trace Context header:

```text
traceparent
```

to the backend.

The Node.js OpenTelemetry instrumentation extracts that trace context and creates the backend span as part of the same trace.

A distributed trace can therefore look similar to:

```text
task-manager-frontend
        |
        └── fetch POST /tasks
                |
                └── task-manager-backend
                        |
                        └── POST /tasks
```

This allows the complete request flow to be inspected in Jaeger.

---

# REST API

The backend exposes the following endpoints:

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/`          | Backend health/test endpoint |
| GET    | `/tasks`     | Retrieve all tasks           |
| POST   | `/tasks`     | Create a new task            |
| PUT    | `/tasks/:id` | Update an existing task      |
| DELETE | `/tasks/:id` | Delete a task                |

---

## Example Task

A task is stored using the following structure:

```json
{
  "id": 123456789,
  "title": "Learn OpenTelemetry",
  "completed": false
}
```

---

# CRUD Operations

The application demonstrates the four basic CRUD operations:

| Operation | HTTP Method | Implementation |
| --------- | ----------- | -------------- |
| Create    | POST        | Create a task  |
| Read      | GET         | Retrieve tasks |
| Update    | PUT         | Update a task  |
| Delete    | DELETE      | Delete a task  |

---

# Running the Complete Application

Three processes are required.

## Terminal 1 — Jaeger

```bash
docker run --rm --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 jaegertracing/all-in-one:latest --collector.otlp.http.cors.allowed-origins=http://localhost:5173 --collector.otlp.http.cors.allowed-headers=Content-Type
```

## Terminal 2 — Backend

```powershell
cd backend
.\start-otel.ps1
```

## Terminal 3 — Frontend

```bash
cd frontend
npm run dev
```

Open the application:

```text
http://localhost:5173
```

Open Jaeger:

```text
http://localhost:16686
```

---

# Trace Flow

The complete trace flow is:

```text
User
 |
 v
React Application
 |
 | OpenTelemetry Browser Span
 |
 v
fetch()
 |
 | traceparent
 v
Express API
 |
 | OpenTelemetry Node.js Span
 |
 v
Application Logic
 |
 v
tasks.json
```

Both frontend and backend spans are exported using OTLP and can be inspected in Jaeger.

---

# Purpose of the Project

This project was created as a learning and testing environment for full-stack development and observability.

It demonstrates concepts including:

- React
- Node.js
- Express
- REST APIs
- HTTP
- JSON
- CRUD operations
- asynchronous JavaScript
- frontend/backend communication
- OpenTelemetry
- automatic instrumentation
- browser instrumentation
- distributed tracing
- trace-context propagation
- OTLP
- Jaeger
- Docker

---

# Current Limitations

This project is intentionally simple and intended for development and learning purposes.

It currently does not include:

- User authentication
- Authorization
- A production database
- Automated tests
- Production deployment
- TLS/HTTPS
- Production-grade telemetry infrastructure

Task data is stored locally in `tasks.json`.

---

## License

This project is intended for educational and testing purposes.
