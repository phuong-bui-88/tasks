# Task Management Application

A full-stack task management application with CRUD operations and email notifications for overdue tasks.

## Features

- Create, read, update, and delete tasks
- Email notifications for overdue tasks
- Responsive user interface

## Tech Stack

- **Frontend**: React.js
- **Backend**: Java (Spring Boot)
- **Database**: MySQL
- **Containerization**: Docker

## Project Structure

```
tasks/
├── frontend/          # React.js frontend application
├── backend/           # Java Spring Boot backend application
├── docker-compose.yml # Docker configuration
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Installation and Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd tasks
```

2. Configure application settings (optional):
```bash
# Copy the sample .env file and modify as needed
cp .env.example .env
# Edit the .env file to customize ports and other settings
nano .env
```

3. Start the application using Docker Compose:
```bash
docker-compose up -d
```
   This will start both the frontend and backend services in containers.

4. Access the application:
   - Frontend: http://localhost:${FRONTEND_PORT} (default: 3000)
   - Backend API: http://localhost:${BACKEND_PORT} (default: 8080)
   - MySQL Database: localhost:${MYSQL_PORT} (default: 3306)

## Containerization

Both frontend and backend are containerized with Docker:

- Frontend container runs a Node.js environment serving the React application
- Backend container runs the Spring Boot application
- Database runs in a separate MySQL container
- All services are defined and orchestrated via docker-compose

## Port Customization

You can customize the ports for each service by modifying the variables in the `.env` file:

- `FRONTEND_PORT`: The port for accessing the React frontend (default: 3000)
- `BACKEND_PORT`: The port for accessing the Spring Boot API (default: 8080)
- `MYSQL_PORT`: The port for accessing the MySQL database (default: 3306)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/tasks | Get all tasks |
| GET    | /api/tasks/{id} | Get task by ID |
| POST   | /api/tasks | Create a new task |
| PUT    | /api/tasks/{id} | Update an existing task |
| DELETE | /api/tasks/{id} | Delete a task |

## Development

### Local Development

While Docker is the recommended way to run the complete application, you can also run components individually:

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

## Email Notifications

The system automatically checks for overdue tasks and sends email notifications to users. This is handled by a scheduled job in the backend.