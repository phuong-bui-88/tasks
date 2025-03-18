# Backend API Documentation

## API Summary

This API provides endpoints for user authentication and user management in the task tracking system.

### Available Endpoints

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 3 | User registration, login and logout |
| User Management | 1 | Update user information |

### Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
   - [Register User](#register-user)
   - [Login User](#login-user)
   - [Logout User](#logout-user)
2. [User Management Endpoints](#user-management-endpoints)
   - [Update User](#update-user)

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
