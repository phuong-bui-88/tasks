# User DTO Update Instructions

To align with the User entity changes (removing all name fields), you'll need to update the related DTO classes.

## Changes Required

1. Update `UserDTO.java`:
   - Remove `firstName`, `lastName`, and `fullName` fields

2. Update `UserCreateDTO.java`:
   - Remove `firstName`, `lastName`, and `fullName` fields 

3. Update `UserUpdateDTO.java`:
   - Remove `firstName`, `lastName`, and `fullName` fields

## Example Implementation for UserDTO

```java
@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private boolean active;
    // Other fields and methods remain unchanged
}
```

## Example Implementation for UserCreateDTO

```java
@Data
public class UserCreateDTO {
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    private String role;
    // Other fields and methods remain unchanged
}
```

## Example Implementation for UserUpdateDTO

```java
@Data
public class UserUpdateDTO {
    private String username;
    private String email;
    private String password;
    private String role;
    private Boolean active;
    // Other fields and methods remain unchanged
}
```

## Database Migration

If you're using a database migration tool like Flyway or Liquibase, you'll need to create a migration script to remove any name-related columns:

```sql
-- Drop name-related columns
ALTER TABLE users DROP COLUMN IF EXISTS first_name;
ALTER TABLE users DROP COLUMN IF EXISTS last_name;
ALTER TABLE users DROP COLUMN IF EXISTS full_name;
```

## Frontend Changes

You'll need to update any frontend components that reference name fields:

1. Registration forms - remove name fields
2. User profile components - remove name fields
3. User listing components - remove name display
4. Header/navigation components - update user information display

### Example of updated React component:

```jsx
function UserProfile({ user }) {
  return (
    <div className="profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
```
