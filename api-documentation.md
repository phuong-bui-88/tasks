# Task Management API Documentation

## Authentication Endpoints

### Register New User

This endpoint allows new users to create an account in the system.

**URL**: `/api/register`
**Method**: `POST`
**Content-Type**: `application/json`
**Authentication**: None

#### Request Body

| Field      | Type     | Required | Description                               |
|------------|----------|----------|-------------------------------------------|
| username   | String   | Yes      | User's unique username (3-50 characters)  |
| email      | String   | Yes      | User's email address                      |
| password   | String   | Yes      | User's password (min. 8 characters)       |
| firstName  | String   | Yes      | User's first name                         |
| lastName   | String   | Yes      | User's last name                          |
| role       | String   | No       | User role (defaults to "USER")            |

#### Example Request

```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### Success Response

**Code**: `201 CREATED`

**Content example**:

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createdAt": "2023-07-15T14:30:45.123Z"
}
```

#### Error Responses

**Condition**: Username already exists

**Code**: `400 BAD REQUEST`

**Content example**:

```json
{
  "status": "error",
  "message": "Username already exists",
  "timestamp": "2023-07-15T14:30:45.123Z",
  "path": "/api/register"
}
```

**Condition**: Invalid email format

**Code**: `400 BAD REQUEST`

**Content example**:

```json
{
  "status": "error",
  "message": "Invalid email format",
  "timestamp": "2023-07-15T14:30:45.123Z",
  "path": "/api/register"
}
```

**Condition**: Password does not meet requirements

**Code**: `400 BAD REQUEST`

**Content example**:

```json
{
  "status": "error",
  "message": "Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number",
  "timestamp": "2023-07-15T14:30:45.123Z",
  "path": "/api/register"
}
```

#### Notes

- Password will be securely hashed before storage
- Email verification may be required depending on system configuration
- User accounts are created with inactive status until email verification is completed
