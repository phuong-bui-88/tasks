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

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/tasks | Get all tasks (supports pagination with ?page=0&size=10) |
| GET    | /api/tasks/{id} | Get task by ID |
| GET    | /api/tasks/user/{userId} | Get all tasks for a specific user |
| GET    | /api/tasks/category/{category} | Get tasks by category |
| GET    | /api/tasks/priority/{priority} | Get tasks by priority level |
| GET    | /api/tasks/overdue | Get all overdue tasks |
| POST   | /api/tasks | Create a new task |
| PUT    | /api/tasks/{id} | Update an existing task |
| DELETE | /api/tasks/{id} | Delete a task |
| PATCH  | /api/tasks/{id}/status | Update task status |
| POST   | /api/tasks/bulk | Perform bulk operations on tasks |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users | Get all users (admin only) |
| GET    | /api/users/{id} | Get user by ID |
| POST   | /api/users | Create a new user |
| PUT    | /api/users/{id} | Update an existing user |
| DELETE | /api/users/{id} | Delete a user |
| POST   | /api/auth/login | User login |
| POST   | /api/auth/register | User registration |

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

### Email Configuration

Email notifications use SMTP and can be configured in the application properties:

```properties
spring.mail.host=smtp.example.com
spring.mail.port=587
spring.mail.username=your-email@example.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Notification Types

1. **Overdue Task Notifications**: Sent daily to users with overdue tasks
2. **Upcoming Due Date Reminder**: Sent 2 days before the task due date
3. **Task Assignment Notification**: Sent when a task is assigned to a user
4. **Task Status Change**: Sent when a task status changes

## Testing

### Frontend Testing

The frontend uses Jest and React Testing Library for unit and component testing:

```bash
cd frontend
npm test
```

### Backend Testing

The backend uses JUnit and Mockito for unit and integration testing:

```bash
cd backend
./mvnw test
```

### End-to-End Testing

E2E testing is implemented using Cypress:

```bash
cd frontend
npm run cypress:open
```