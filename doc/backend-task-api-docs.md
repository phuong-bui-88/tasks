# Task Management API Documentation

## API Summary

This API provides endpoints for task management in the task tracking system.

### Available Task Endpoints

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Task Management | 5 | CRUD operations for tasks, status filtering, and task authorship |

### Table of Contents

1. [Task Management Endpoints](#task-management-endpoints)
   - [Create Task](#create-task)
   - [Get Task by ID](#get-task-by-id)
   - [Get All Tasks](#get-all-tasks)
   - [Get Tasks by Status](#get-tasks-by-status)
   - [Update Task](#update-task)
   - [Delete Task](#delete-task)
   - [Get My Tasks](#get-my-tasks)

## Task Management Endpoints

### Create Task
`POST /api/tasks`

Creates a new task in the system. The author is automatically determined from the JWT token of the authenticated user making the request.

#### Request

```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Implement user authentication",
  "description": "Add JWT authentication to the backend API",
  "startDate": "2023-11-30T09:00:00",
  "status": 1, // 1 = PENDING, 2 = COMPLETED
  "dueDate": "2023-12-15T12:00:00"
}
```

#### Response

**Success (201 Created)**
```json
{
  "id": 1,
  "title": "Implement user authentication",
  "description": "Add JWT authentication to the backend API",
  "startDate": "2023-11-30T09:00:00",
  "status": 1,
  "dueDate": "2023-12-15T12:00:00",
  "authorId": 123,
  "authorUsername": "johndoe"
}
```

**Failure (400 Bad Request)**
```json
{
  "timestamp": "2023-11-10T08:30:45",
  "status": 400,
  "error": "Bad Request",
  "message": "Title cannot be empty",
  "path": "/api/tasks"
}
```

**Failure (401 Unauthorized)**
```json
{
  "timestamp": "2023-11-10T08:30:45",
  "status": 401,
  "error": "Unauthorized",
  "message": "User not authenticated",
  "path": "/api/tasks"
}
```

#### Implementation Details

The create task endpoint is implemented in the `TaskController` class and uses the `TaskService` for business logic:

1. Extracts the authenticated user from the JWT token
2. Validates the incoming task data
3. Creates a new Task entity with the authenticated user as author
4. Sets the task's properties including title, description, startDate, dueDate, and status
5. Saves the task to the database
6. Returns the created task information

#### Related Files
- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `Task.java`: Entity class representing a task
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations
- `SecurityUtils.java`: Utility class for extracting user information from JWT token

#### Sample cURL
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT authentication to the backend API",
    "startDate": "2023-11-30T09:00:00",
    "status": 1,
    "dueDate": "2023-12-15T12:00:00"
  }'
```

### Get Task by ID
`GET /api/tasks/{id}`

Retrieves a task by its ID.

#### Request

```http
GET /api/tasks/1
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
{
  "id": 1,
  "title": "Implement user authentication",
  "description": "Add JWT authentication to the backend API",
  "startDate": "2023-11-30T09:00:00",
  "status": 1,
  "dueDate": "2023-12-15T12:00:00",
  "authorId": 123,
  "authorUsername": "johndoe"
}
```

**Failure (404 Not Found)**
```json
{
  "timestamp": "2023-11-10T09:15:20",
  "status": 404,
  "error": "Not Found",
  "message": "Task with id 1 not found",
  "path": "/api/tasks/1"
}
```

#### Implementation Details

The get task endpoint is implemented in the `TaskController` class and uses the `TaskService` for retrieving task data:

1. Validates the task ID
2. Retrieves the task from the database
3. Maps the task entity to a DTO
4. Returns the task information

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations

#### Sample cURL

```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get All Tasks
`GET /api/tasks`

Retrieves all tasks in the system.

#### Request

```http
GET /api/tasks
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
[
  {
    "id": 1,
    "title": "Implement user authentication",
    "description": "Add JWT authentication to the backend API",
    "startDate": "2023-11-30T09:00:00",
    "status": 1,
    "dueDate": "2023-12-15T12:00:00",
    "authorId": 123,
    "authorUsername": "johndoe"
  },
  {
    "id": 2,
    "title": "Design database schema",
    "description": "Create ERD and implement database tables",
    "startDate": "2023-11-01T09:00:00",
    "status": 2,
    "dueDate": "2023-12-01T17:00:00",
    "authorId": 124,
    "authorUsername": "janesmith"
  }
]
```

#### Implementation Details

The get all tasks endpoint is implemented in the `TaskController` class and uses the `TaskService` for retrieving all tasks:

1. Retrieves all tasks from the database
2. Maps each task entity to a DTO
3. Returns a list of all task information

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations

#### Sample cURL

```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Tasks by Status
`GET /api/tasks/status/{status}`

Retrieves all tasks with the specified status.

#### Request

```http
GET /api/tasks/status/1
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
[
  {
    "id": 2,
    "title": "Design database schema",
    "description": "Create ERD and implement database tables",
    "status": 1,
    "priority": "MEDIUM",
    "createdAt": "2023-11-09T14:20:30",
    "updatedAt": "2023-11-10T10:15:45",
    "dueDate": "2023-12-01T17:00:00",
    "authorId": 124,
    "authorUsername": "janesmith"
  },
  {
    "id": 3,
    "title": "Create user interface mockups",
    "description": "Design UI mockups for the task management system",
    "status": 1,
    "priority": "HIGH",
    "createdAt": "2023-11-08T11:45:10",
    "updatedAt": "2023-11-09T16:30:20",
    "dueDate": "2023-11-20T17:00:00",
    "authorId": 125,
    "authorUsername": "alexdesigner"
  }
]
```

#### Implementation Details

The get tasks by status endpoint is implemented in the `TaskController` class and uses the `TaskService` for filtering tasks by status:

1. Validates the status parameter (must be 1 or 2)
2. Retrieves tasks with the specified status from the database
3. Maps each task entity to a DTO
4. Returns a list of filtered task information

The get tasks by status endpoint accepts the status as a path variable:
- 1 - PENDING tasks (not yet completed)
- 2 - COMPLETED tasks

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations

#### Sample cURL

```bash
curl -X GET http://localhost:8080/api/tasks/status/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update Task
`PUT /api/tasks/{id}`

Updates an existing task. The author relationship remains unchanged and cannot be modified through this endpoint.

#### Request

```http
PUT /api/tasks/1
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Implement user authentication and authorization",
  "description": "Add JWT authentication and role-based authorization to the backend API",
  "startDate": "2023-12-01T09:00:00",
  "status": 0, // Status changed from PENDING (1) to COMPLETED (0)
  "dueDate": "2023-12-20T12:00:00"
}

#### Response

**Success (200 OK)**
```json
{
  "id": 1,
  "title": "Implement user authentication and authorization",
  "description": "Add JWT authentication and role-based authorization to the backend API",
  "startDate": "2023-12-01T09:00:00",
  "status": 2,
  "dueDate": "2023-12-20T12:00:00",
  "authorId": 123,
  "authorUsername": "johndoe"
}
```

**Failure (404 Not Found)**
```json
{
  "timestamp": "2023-11-12T14:25:30",
  "status": 404,
  "error": "Not Found",
  "message": "Task with id 1 not found",
  "path": "/api/tasks/1"
}
```

**Failure (401 Unauthorized)**
```json
{
  "timestamp": "2023-11-12T14:25:30",
  "status": 401,
  "error": "Unauthorized",
  "message": "User not authenticated",
  "path": "/api/tasks/1"
}
```

#### Implementation Details

The update task endpoint is implemented in the `TaskController` class and uses the `TaskService` for updating task information:

1. Validates the task ID and incoming data
2. Retrieves the existing task from the database
3. Updates the task fields with the provided values (title, description, startDate, dueDate, status, priority, etc.)
4. Preserves the original author relationship
5. Saves the updated task to the database
6. Returns the updated task information

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `Task.java`: Entity class representing a task
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations

#### Sample cURL

```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Implement user authentication and authorization",
    "description": "Add JWT authentication and role-based authorization to the backend API",
    "startDate": "2023-12-01T09:00:00",
    "status": 0,
    "dueDate": "2023-12-20T12:00:00"
  }'
```

### Delete Task
`DELETE /api/tasks/{id}`

Deletes a task by its ID.

#### Request

```http
DELETE /api/tasks/1
Authorization: Bearer {token}
```

#### Response

**Success (204 No Content)**

**Failure (404 Not Found)**
```json
{
  "timestamp": "2023-11-14T09:45:30",
  "status": 404,
  "error": "Not Found",
  "message": "Task with id 1 not found",
  "path": "/api/tasks/1"
}
```

#### Implementation Details

The delete task endpoint is implemented in the `TaskController` class and uses the `TaskService` for removing tasks:

1. Validates the task ID
2. Checks if the task exists
3. Removes the task from the database
4. Returns a no content response

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `TaskRepository.java`: Repository for database operations

#### Sample cURL

```bash
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get My Tasks
`GET /api/tasks/my-tasks`

Retrieves all tasks created by the authenticated user (as determined by the JWT token).

#### Request

```http
GET /api/tasks/my-tasks
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
[
  {
    "id": 1,
    "title": "Implement user authentication",
    "description": "Add JWT authentication to the backend API",
    "status": 1,
    "priority": "HIGH",
    "createdAt": "2023-11-10T08:30:45",
    "updatedAt": "2023-11-10T08:30:45",
    "dueDate": "2023-12-15T12:00:00",
    "authorId": 123,
    "authorUsername": "johndoe"
  }
  // ...more tasks...
]
```

**Failure (401 Unauthorized)**
```json
{
  "timestamp": "2023-11-10T10:15:30",
  "status": 401,
  "error": "Unauthorized",
  "message": "User not authenticated",
  "path": "/api/tasks/my-tasks"
}
```

#### Implementation Details

The get my tasks endpoint is implemented in the `TaskController` class and uses the `TaskService` for filtering tasks by the authenticated user:

1. Extracts the user information from the JWT token in the authentication context
2. Retrieves tasks with the authenticated user's ID as author
3. Maps each task entity to a DTO
4. Returns a list of filtered task information

#### Related Files

- `TaskController.java`: Controller that handles the HTTP request
- `TaskService.java`: Service that contains business logic for task management
- `TaskDTO.java`: DTO for task data transfer
- `TaskRepository.java`: Repository for database operations
- `SecurityUtils.java`: Utility class for extracting user information from JWT token

#### Sample cURL

```bash
curl -X GET http://localhost:8080/api/tasks/my-tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```