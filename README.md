# Task Management Application

A full-stack task management application with CRUD operations and email notifications for overdue tasks.

## Features

- Create, read, update, and delete tasks
- Create, read, update, and delete users
- Email notifications for overdue tasks
- Responsive user interface
- Task prioritization (High, Medium, Low)
- Task categorization
- Due date tracking with calendar integration
- User role management (Admin, Manager, User)
- Dashboard with task statistics and analytics
- Bulk operations for multiple tasks

## Tech Stack

- **Frontend**: React.js
- **Backend**: Java (Spring Boot)
- **Database**: MySQL
- **Containerization**: Docker

## Architecture

The application follows a standard three-tier architecture:

1. **Presentation Layer**: React.js frontend with component-based UI
2. **Application Layer**: Spring Boot REST API with business logic
3. **Data Layer**: MySQL database for persistent storage

Communication between layers is handled via RESTful APIs, with JWT for authentication and authorization.

## Project Structure

```
tasks/
├── frontend/          # React.js frontend application
├── backend/           # Java Spring Boot backend application
├── docker-compose.yml # Docker configuration
├── README.md          # Project documentation
├── backend-README.md  # Backend-specific documentation
└── frontend-README.md # Frontend-specific documentation
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

## Component Documentation

For detailed information about specific components:

- [Backend Documentation](backend-README.md)
- [Frontend Documentation](frontend-README.md)

## UserService Compilation Error Fix

See [Backend Documentation](backend-README.md) for details on fixing the UserService compilation error.