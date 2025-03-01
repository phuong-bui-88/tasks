# Backend Debugging Guide

This document provides instructions for debugging the Spring Boot backend application using Visual Studio Code.

## Prerequisites

1. Install the following VS Code extensions:
   - Extension Pack for Java
   - Debugger for Java
   - Spring Boot Extension Pack

2. Make sure your project is opened in VS Code and the Java extensions have properly loaded.

## Debug Configurations

We've set up multiple debug configurations for different scenarios:

1. **Debug Spring Boot Backend** - Launches the main Spring Boot application in debug mode
2. **Debug Spring Boot Tests** - For debugging unit and integration tests
3. **Attach to Backend** - For attaching to a running backend with remote debugging enabled
4. **Debug Backend in Docker** - For debugging the backend running in a Docker container
5. **Debug Backend JUnit Tests** - For debugging all JUnit tests in the project
6. **Debug Specific Test Class** - For debugging a specific test class that you select

## How to Debug

### Starting a Debug Session

1. Open VS Code and navigate to the Debug view (Ctrl+Shift+D / Cmd+Shift+D)
2. Select the desired debug configuration from the dropdown menu
3. Click the green play button or press F5 to start debugging

### Setting Breakpoints

1. Open the Java source file where you want to set a breakpoint
2. Click in the gutter to the left of the line numbers where you want to pause execution
3. A red dot will appear indicating a breakpoint

### Enabling Remote Debugging

To enable remote debugging with the "Attach to Backend" configuration, you can:

1. Use the provided VS Code task:
   - Press Ctrl+Shift+P (or Cmd+Shift+P on macOS)
   - Type "Tasks: Run Task" and select "Start Backend with Remote Debug"
   
2. Or start the Spring Boot application manually:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
   ```

3. Then use the "Attach to Backend" configuration to connect to it.

### Debugging JUnit Tests

1. To debug all tests: Select the "Debug Backend JUnit Tests" configuration
2. To debug a specific test class: 
   - Select the "Debug Specific Test Class" configuration
   - When prompted, enter the fully qualified class name (e.g., com.tasks.service.TaskServiceTest)

Alternatively, you can:

1. Open a test file
2. Click on the "Run Test" or "Debug Test" button that appears above the test method
3. VS Code will execute the test in debug mode

### Docker Debugging

For debugging the application running in Docker:

1. Make sure your backend Dockerfile includes the Java debug agent:
   ```docker
   ENV JAVA_TOOL_OPTIONS "-agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n"
   ```

2. Update your docker-compose.yml file to expose port 5005:
   ```yaml
   backend:
     # ...existing configuration...
     ports:
       - "8080:8080"
       - "5005:5005"
   ```

3. Start the Docker container with:
   ```bash
   docker-compose up -d backend
   ```
   Or if you need to rebuild:
   ```bash
   docker-compose up -d --build backend
   ```
   - Wait until the application is fully started
   - You can check logs with: `docker-compose logs -f backend`

4. Use the "Debug Backend in Docker" configuration to connect to it:
   - Go to the Run and Debug view (Ctrl+Shift+D / Cmd+Shift+D)
   - Select "Debug Backend in Docker" from the dropdown menu
   - Click the green play button or press F5
   - VS Code will attach to the running container's debug port
   - You should see "Debugger attached" in the Debug Console

## Common Debug Actions

- **Step Over**: F10 - Execute the current line and move to the next line
- **Step Into**: F11 - Step into a method call
- **Step Out**: Shift+F11 - Complete the current method and return to the caller
- **Continue**: F5 - Resume execution until the next breakpoint
- **Hot Code Replace**: VS Code's Java extension supports hot code replacement while debugging

## Advanced Debugging Features

### Conditional Breakpoints

1. Set a normal breakpoint by clicking in the gutter
2. Right-click on the breakpoint
3. Select "Edit Breakpoint"
4. Enter a condition (e.g., `user.getId() == 1`) that must be true for the breakpoint to trigger

### Expression Evaluation

1. During a debug session, use the Debug Console (View > Debug Console)
2. In the console, you can evaluate Java expressions in the current context

### Watch Expressions

1. In the Debug view, find the "WATCH" section
2. Click the plus icon to add a new watch expression
3. Enter a variable or expression to monitor during debugging

### Data Breakpoints

1. During a debug session, right-click on a field in the Variables view
2. Select "Break on Value Change"
3. The debugger will stop when the value of this field changes

### Logpoints

Logpoints let you print messages to the console without modifying code:

1. Right-click in the gutter where you would set a breakpoint
2. Select "Add Logpoint"
3. Enter a message (can include expressions in curly braces like `{variable}`)

## Troubleshooting

### No main class found
- Ensure the main class name in launch.json matches your application's main class
- Check that the project structure is correctly recognized by VS Code

### Cannot connect to remote JVM
- Check that the port (5005) is correctly exposed and not blocked by a firewall
- Verify that the JVM is started with the correct debugging parameters
- Try running `netstat -an | grep 5005` to ensure the port is listening

### Breakpoints not hitting
- Verify that the source code matches the running code
- Ensure the class is loaded by the JVM when your breakpoint is set
- Try setting a breakpoint in a method you're sure is called

### Hot Code Replace fails
- Some changes (like adding methods or changing method signatures) require a restart
- Try to limit changes to method bodies during debugging sessions

## Spring Boot Specific Debugging Tips

### Debugging Application Startup
To debug application startup, including Spring Boot auto-configuration:

1. Set breakpoints in the `main` method
2. Choose the "Debug Spring Boot Backend" configuration
3. Set the `suspend=y` parameter in launch.json to pause execution at startup

### Debugging Spring Bean Creation
To debug bean creation and dependency injection:

1. Set breakpoints in bean constructors or `@PostConstruct` methods
2. Start debugging the application

### Debugging Spring Security
To debug authentication and authorization:

1. Set breakpoints in security configuration classes
2. Set breakpoints in custom authentication providers or user details services
3. Enable Spring Security debug logging by adding to application.properties:
   ```
   logging.level.org.springframework.security=DEBUG
   ```
