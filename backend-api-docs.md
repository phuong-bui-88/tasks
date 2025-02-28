# Backend API Documentation

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
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string" (optional, defaults to "USER")
}
```

#### Response

**Success (201 Created)**
```json
{
  "id": "long",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string",
  "createdAt": "timestamp",
  "message": "User registered successfully"
}
```

**Failure (400 Bad Request)**
```json
{
  "timestamp": "timestamp",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already in use",
  "path": "/api/auth/register"
}
```

**Failure (400 Bad Request)**
```json
{
  "timestamp": "timestamp",
  "status": 400,
  "error": "Bad Request",
  "message": "Username already taken",
  "path": "/api/auth/register"
}
```

#### Implementation Details

The registration endpoint is implemented in the `AuthController` class and uses the `UserService` for business logic:

1. Validates the incoming registration request
2. Checks if username or email already exists
3. Encodes the password using BCrypt
4. Creates a new User entity
5. Saves the user to the database
6. Returns user information without the password

#### Related Files

- `AuthController.java`: Controller that handles the HTTP request
- `UserService.java`: Service that contains business logic for user management
- `User.java`: Entity class representing a user
- `UserRepository.java`: Repository for database operations
- `SecurityConfig.java`: Security configuration for authentication

#### Sample cURL

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Security Considerations

- Passwords are hashed using BCrypt before storage
- Email verification is implemented (optional feature that can be enabled)
- Rate limiting is applied to prevent brute force attacks
- Input validation is performed for all fields
