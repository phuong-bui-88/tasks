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
