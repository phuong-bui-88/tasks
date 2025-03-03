# API Usage Examples

This document provides examples of how to interact with the Task Management API using curl commands.

## Task Operations

### Create a New Task

Use the following curl command to create a new task:

```bash
curl -X POST "http://localhost:9080/api/tasks" -H "Content-Type: application/json" -d '{"title": "New Task", "description": "Task description"}'
```

## User Operations

### Register a New User

```bash
curl -X POST "http://localhost:9080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"123456","email":"ghetrung2@gmail.com","roles":[{"id":1},{"id":2}]}'
```

### Register a New User (Without Specifying Roles - Will Use Default ROLE_USER)

```bash
curl -X POST "http://localhost:9080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"123456","email":"ghetrung2@gmail.com"}'
```

## Role Operations

### Get All Roles

```bash
curl -X GET "http://localhost:9080/api/roles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a New Role

```bash
curl -X POST "http://localhost:9080/api/roles" \
  -H "Content-Type: application/json" \
  -d '{"name":"ROLE_MANAGER"}'
```

> Note: The system automatically initializes with two default roles on startup:
> - ROLE_USER (ID: 1)
> - ROLE_ADMIN (ID: 2)