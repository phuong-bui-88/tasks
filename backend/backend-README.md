# Task Management Backend

This is the backend component of the Task Management application, built with Java Spring Boot.

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

## Backend Development

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

## Backend Testing

The backend uses JUnit and Mockito for unit and integration testing:

```bash
cd backend
./mvnw test
```

## UserService Compilation Error Fix

### Problem
The UserService.java file has compilation errors where code appears outside of a class or method definition. The errors occur at lines 135, 137-140, and 142-143.

### Cause
This is typically caused by:
1. Missing closing braces (`}`)
2. Extra code outside of the class definition
3. Incorrect nesting of classes or methods

### Solution
We've created a utility script `UserServiceFix.java` that:
1. Reads the problematic file
2. Analyzes the brace structure
3. Adds missing closing braces where needed
4. Writes the corrected file back to disk

### Manual Fix Instructions
If the automatic script doesn't work, you can manually fix the file by:

1. Open `/app/src/main/java/com/tasks/service/UserService.java`
2. Look at line 135 and below
3. Check for any code that is outside of method definitions
4. Ensure all opened braces are properly closed
5. Make sure the class definition is properly closed with a `}`
6. Check for any dangling code after the class closing brace

### Common Patterns That Cause This Error
- Missing closing braces for methods or internal classes
- Unintentional code or text outside of method definitions
- Copy-pasted code fragments that weren't properly integrated into the class structure
- Commented out code with mismatched comment delimiters
