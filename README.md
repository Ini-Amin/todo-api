# To-Do API

This is a RESTful CRUD API built with Express.js for managing a To-Do list. The application and database are fully containerized using Docker, with data persisting via PostgreSQL.

## How to Install & Run

Ensure you have Docker and Docker Compose installed on your system.

1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Start the application and database together:
   ```bash
   docker compose up --build -d
   ```
The API will be available at `http://localhost:3000`.

## Endpoints

| CRUD operation | HTTP method | Endpoint | Meaning |
|---|---|---|---|
| Read (All) | `GET` | `/tasks` | List all tasks |
| Read (Single) | `GET` | `/tasks/:id` | Get task by ID |
| Create | `POST` | `/tasks` | Add a new task |
| Update | `PUT` | `/tasks/:id` | Change task by ID |
| Delete | `DELETE` | `/tasks/:id` | Remove task by ID |
| Documentation | `GET` | `/docs` | Interactive Swagger UI |
| Health Check | `GET` | `/health` | Check if server is running |

## Architecture

This iteration of the project implements the Repository Pattern to decouple the API routing logic from the database logic.
- `index.js`: Handles incoming HTTP requests, validation, and responses.
- `taskRepository.js`: Handles direct communication and SQL queries to the PostgreSQL database.

## Swagger UI

Interactive API documentation is available at `/docs`.

![Swagger UI Screenshot](./screenshot.png)
