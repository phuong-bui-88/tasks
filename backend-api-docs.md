# Backend API Documentation

## API Summary

This API provides endpoints for user authentication, user management, and task management in the task tracking system.

### Available Endpoints

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 3 | User registration, login and logout |
| User Management | 1 | Update user information |
| Task Management | 9 | CRUD operations for tasks, status filtering, reminder management, and task authorship |

### Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
   - [Register User](#register-user)
   - [Login User](#login-user)
   - [Logout User](#logout-user)
2. [User Management Endpoints](#user-management-endpoints)
   - [Update User](#update-user)
3. [Task Management Endpoints](#task-management-endpoints)
   - [Create Task](#create-task)
   - [Get Task by ID](#get-task-by-id)
   - [Get All Tasks](#get-all-tasks)
   - [Get Tasks by Status](#get-tasks-by-status)
   - [Get Tasks by Assignee](#get-tasks-by-assignee)
   - [Update Task](#update-task)
   - [Delete Task](#delete-task)
   - [Get Tasks Due for Reminder](#get-tasks-due-for-reminder)
   - [Mark Reminder as Sent](#mark-reminder-as-sent)
   - [Get My Tasks](#get-my-tasks)

## Authentication Endpoints

### Register User
`POST /api/auth/register`

Registers a new user in the system.

#### Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "string",
  "email": "string",
  "roles": ["ROLE_USER"]
}
```

**Failure (400 Bad Request)**
```json
{
  "success": false,
  "message": "Username is already taken",
  "token": null,
  "userId": null,
  "username": null,
  "email": null,
  "roles": null
}
```

**Failure (400 Bad Request)**
```json
{
  "success": false,
  "message": "Email is already in use",
  "token": null,
  "userId": null,
  "username": null,
  "email": null,
  "roles": null
}
```

#### Implementation Details

The registration endpoint is implemented in the `AuthController` class and uses the `UserService.registerUser()` method for business logic:

1. Validates the incoming registration request
2. Checks if username already exists using `userRepository.existsByUsername()`
3. Checks if email already exists using `userRepository.existsByEmail()`
4. Encodes the password using BCrypt via the passwordEncoder
5. Creates a new User entity with ROLE_USER as the default role
6. Sets the user as active and records creation timestamp
7. Saves the user to the database
8. Generates a JWT token for the newly registered user
9. Returns an AuthResponse object containing the success status, token and user information

#### Related Files

- `AuthController.java`: Controller that handles the HTTP request
- `UserService.java`: Service interface defining the registerUser method
- `UserServiceImpl.java`: Implementation of the registration logic
- `User.java`: Entity class representing a user
- `UserRepository.java`: Repository for database operations
- `JwtService.java`: Service for generating JWT tokens
- `SecurityConfig.java`: Security configuration for authentication

### Login User
`POST /api/auth/login`

Authenticates a user and returns a JWT token.

#### Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string", // Can be username or email
  "password": "string"
}
```

#### Response

**Success (200 OK)**
```json
{
  "token": "string",
  "type": "Bearer",
  "id": "long",
  "username": "string",
  "email": "string",
  "roles": ["string"],
  "expiresIn": "number" // seconds until token expiration
}
```

**Failure (401 Unauthorized)**
```json
{
  "timestamp": "timestamp",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username/password combination",
  "path": "/api/auth/login"
}
```

**Failure (423 Locked)**
```json
{
  "timestamp": "timestamp",
  "status": 423,
  "error": "Locked",
  "message": "Account is locked due to too many failed attempts",
  "path": "/api/auth/login"
}
```

#### Implementation Details

The login endpoint is implemented in the `AuthController` class:

1. Authenticates user credentials against the database
2. If valid, generates a JWT token with appropriate claims
3. Records the successful login attempt
4. Returns the token along with user information

#### Related Files

- `AuthController.java`: Controller handling login requests
- `JwtTokenProvider.java`: Service for JWT token generation and validation
- `UserDetailsServiceImpl.java`: Custom user details service for Spring Security
- `LoginRequest.java`: DTO for login requests
- `JwtResponse.java`: DTO for JWT responses

#### Sample cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePassword123!"
  }'
```

#### Security Considerations

- Failed login attempts are tracked to prevent brute force attacks
- JWT tokens have a configurable expiration time
- Sensitive operations require re-authentication
- Session information is not stored server-side (stateless)

### Logout User
`POST /api/auth/logout`

Logs out the currently authenticated user by invalidating their JWT token.

#### Request

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Failure (401 Unauthorized)**
```json
{
  "timestamp": "timestamp",
  "status": 401,
  "error": "Unauthorized",
  "message": "No active session found",
  "path": "/api/auth/logout"
}
```

#### Implementation Details

The logout endpoint is implemented in the `AuthController` class and uses the `UserService` for handling user session termination:

1. Validates the authenticated user's token
2. Invalidates the token (adds to blacklist or revokes it)
3. Clears any server-side session data
4. Returns a success response

#### Related Files

- `AuthController.java`: Controller that handles the HTTP request
- `UserService.java`: Service that contains the `logoutUser()` method
- `JwtTokenProvider.java`: Service for JWT token validation and revocation
- `SecurityConfig.java`: Security configuration

#### Sample cURL

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Security Considerations

- Token revocation is handled on the server side
- Blacklisted tokens cannot be reused
- Client is responsible for removing the token from local storage
- Sensitive operations after logout require re-authentication

## User Management Endpoints

### Update User
`PUT /api/users/{id}`

Updates an existing user's information.

#### Request

```http
PUT /api/users/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "username": "string", (optional)
  "firstName": "string", (optional)
  "lastName": "string", (optional)
  "email": "string", (optional)
  "password": "string", (optional)
  "role": "string" (optional)
}
```

#### Response

**Success (200 OK)**
```json
{
  "id": "long",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string",
  "updatedAt": "timestamp"
}
```

**Failure (404 Not Found)**
```json
{
  "timestamp": "timestamp",
  "status": 404,
  "error": "Not Found",
  "message": "User with id {id} not found",
  "path": "/api/users/{id}"
}
```

**Failure (400 Bad Request)**
```json
{
  "timestamp": "timestamp",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already in use",
  "path": "/api/users/{id}"
}
```

**Failure (403 Forbidden)**
```json
{
  "timestamp": "timestamp",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to update this user",
  "path": "/api/users/{id}"
}
```

#### Implementation Details

The update user endpoint is implemented in the `UserController` class and uses the `UserService` for business logic:

1. Validates the user's permission to update the target user
2. Validates the incoming update request
3. If updating email/username, checks if it conflicts with existing users
4. If updating password, encodes it using BCrypt
5. Updates the User entity with provided fields
6. Saves the updated user to the database
7. Returns the updated user information

#### Related Files

- `UserController.java`: Controller that handles the HTTP request
- `UserService.java`: Service that contains business logic for user management
- `User.java`: Entity class representing a user
- `UserRepository.java`: Repository for database operations
- `UserUpdateDTO.java`: DTO for user update requests

#### Sample cURL

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com"
  }'
```

#### Security Considerations

- Authentication is required (valid JWT token)
- Authorization is enforced (users can only update their own information unless they have ADMIN role)
- Password changes trigger security notifications (email)
- Input validation is performed for all fields
- Changes to sensitive fields (email, role) may require additional verification

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
  "priority": "HIGH",
  "dueDate": "2023-12-15T12:00:00",
  "assigneeEmail": "john.doe@example.com",
  "reminderDate": "2023-12-14T09:00:00"
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
  "priority": "HIGH",
  "createdAt": "2023-11-10T08:30:45",
  "updatedAt": "2023-11-10T08:30:45",
  "dueDate": "2023-12-15T12:00:00",
  "assigneeEmail": "john.doe@example.com",
  "assigneeName": "John Doe",
  "reminderDate": "2023-12-14T09:00:00",
  "reminderSent": false,
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
4. Associates the task with the assignee if specified
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
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2023-12-15T12:00:00",
    "assigneeEmail": "john.doe@example.com",
    "reminderDate": "2023-12-14T09:00:00"
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
  "priority": "HIGH",
  "createdAt": "2023-11-10T08:30:45",
  "updatedAt": "2023-11-10T08:30:45",
  "dueDate": "2023-12-15T12:00:00",
  "assigneeEmail": "john.doe@example.com",
  "assigneeName": "John Doe",
  "reminderDate": "2023-12-14T09:00:00",
  "reminderSent": false
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
    "priority": "HIGH",
    "createdAt": "2023-11-10T08:30:45",
    "updatedAt": "2023-11-10T08:30:45",
    "dueDate": "2023-12-15T12:00:00",
    "assigneeEmail": "john.doe@example.com",
    "assigneeName": "John Doe",
    "reminderDate": "2023-12-14T09:00:00",
    "reminderSent": false
  },
  {
    "id": 2,
    "title": "Design database schema",
    "description": "Create ERD and implement database tables",
    "startDate": "2023-11-01T09:00:00",
    "status": 2,
    "priority": "MEDIUM",
    "createdAt": "2023-11-09T14:20:30",
    "updatedAt": "2023-11-10T10:15:45",
    "dueDate": "2023-12-01T17:00:00",
    "assigneeEmail": "jane.smith@example.com",
    "assigneeName": "Jane Smith",
    "reminderDate": "2023-11-30T09:00:00",
    "reminderSent": false
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
    "assigneeEmail": "jane.smith@example.com",
    "assigneeName": "Jane Smith",
    "reminderDate": "2023-11-30T09:00:00",
    "reminderSent": false
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
    "assigneeEmail": "alex.designer@example.com",
    "assigneeName": "Alex Designer",
    "reminderDate": "2023-11-19T09:00:00",
    "reminderSent": false
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
  "status": 2, // Status changed from PENDING (1) to COMPLETED (2)
  "priority": "HIGH",
  "dueDate": "2023-12-20T12:00:00",
  "assigneeEmail": "john.doe@example.com",
  "reminderDate": "2023-12-19T09:00:00"
}
```

#### Response

**Success (200 OK)**
```json
{
  "id": 1,
  "title": "Implement user authentication and authorization",
  "description": "Add JWT authentication and role-based authorization to the backend API",
  "startDate": "2023-12-01T09:00:00",
  "status": 2,
  "priority": "HIGH",
  "createdAt": "2023-11-10T08:30:45",
  "updatedAt": "2023-11-12T14:25:30",
  "dueDate": "2023-12-20T12:00:00",
  "assigneeEmail": "john.doe@example.com",
  "assigneeName": "John Doe",
  "reminderDate": "2023-12-19T09:00:00",
  "reminderSent": false,
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
3. Updates the task fields with the provided values
4. Updates the assignee if the assignee email has changed
5. Preserves the original author relationship
6. Saves the updated task to the database
7. Returns the updated task information

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
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2023-12-20T12:00:00",
    "assigneeEmail": "john.doe@example.com",
    "reminderDate": "2023-12-19T09:00:00"
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

### Get Tasks Due for Reminder
`GET /api/tasks/reminders`

Retrieves all tasks that are due for reminders.

#### Request

```http
GET /api/tasks/reminders
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
[
  {
    // TaskDTO response
  },
  // ...more tasks...
]
```

#### Implementation Details

The get tasks due for reminder endpoint is implemented in the `TaskController` class and uses the `TaskService` for identifying tasks requiring reminders.

### Mark Reminder as Sent
`PUT /api/tasks/{id}/reminder-sent`

Marks a task's reminder as sent.

#### Request

```http
PUT /api/tasks/{id}/reminder-sent
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**

**Failure (404 Not Found)**
```json
{
  "timestamp": "timestamp",
  "status": 404,
  "error": "Not Found",
  "message": "Task with id {id} not found",
  "path": "/api/tasks/{id}/reminder-sent"
}
```

#### Implementation Details

The mark reminder as sent endpoint is implemented in the `TaskController` class and uses the `TaskService` to update the reminder status of a task.

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
    "assigneeEmail": "john.doe@example.com",
    "assigneeName": "John Doe",
    "reminderDate": "2023-12-14T09:00:00",
    "reminderSent": false,
    "authorId": 123,
    "authorUsername": "johndoe"
  },
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
