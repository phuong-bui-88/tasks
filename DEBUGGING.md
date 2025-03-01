# Debugging Guide for Tasks Project

This guide covers debugging techniques for both the frontend React application and the Spring Boot backend using Visual Studio Code.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Debugging the Backend](#debugging-the-backend)
3. [Debugging the Frontend](#debugging-the-frontend)
4. [Full-Stack Debugging](#full-stack-debugging)
5. [Debugging in Docker](#debugging-in-docker)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following VS Code extensions installed:

### For Backend Debugging
- Extension Pack for Java
- Debugger for Java
- Spring Boot Extension Pack

### For Frontend Debugging
- JavaScript Debugger
- Chrome Debugger Extension
- React Developer Tools (Chrome Extension)

## Debugging the Backend

### Available Debug Configurations

1. **Debug Spring Boot Backend** - Launches the main Spring Boot application in debug mode
2. **Debug Spring Boot Tests** - For debugging unit and integration tests
3. **Attach to Backend** - For attaching to a running backend with remote debugging enabled
4. **Debug Backend in Docker** - For debugging the backend running in a Docker container
5. **Debug Backend JUnit Tests** - For debugging all JUnit tests in the project
6. **Debug Specific Test Class** - For debugging a specific test class that you select

### Starting a Backend Debug Session

1. Open VS Code and navigate to the Debug view (Ctrl+Shift+D / Cmd+Shift+D)
2. Select "Debug Spring Boot Backend" from the dropdown menu
3. Click the green play button or press F5 to start debugging

### Setting Breakpoints in Java Code

1. Open the Java source file where you want to set a breakpoint
2. Click in the gutter to the left of the line numbers where you want to pause execution
3. A red dot will appear indicating a breakpoint

### Advanced Backend Debugging Techniques

#### Conditional Breakpoints
1. Set a normal breakpoint by clicking in the gutter
2. Right-click on the breakpoint
3. Select "Edit Breakpoint"
4. Enter a condition (e.g., `user.getId() == 1`) that must be true for the breakpoint to trigger

#### Hot Code Replace
VS Code's Java extension supports hot code replacement while debugging. When you modify code during a debug session, the changes can be applied without restarting:

1. Make changes to your Java code while a debug session is active
2. Save the file
3. The changes will automatically be applied if possible
4. For more complex changes, you'll be prompted to restart the debug session

#### Debugging JUnit Tests

1. To debug all tests: Select the "Debug Backend JUnit Tests" configuration
2. To debug a specific test class:
   - Select the "Debug Specific Test Class" configuration
   - When prompted, enter the fully qualified class name (e.g., com.tasks.service.TaskServiceTest)

#### Watch Expressions
1. In the Debug view, find the "WATCH" section
2. Click the plus icon to add a new watch expression
3. Enter a variable or expression to monitor during debugging

## Debugging the Frontend

### Available Debug Configurations

1. **Debug Frontend in Chrome** - Launches Chrome and attaches the debugger to your React application
2. **Debug Frontend Tests** - Allows you to debug Jest tests for the React components

### Starting a Frontend Debug Session

1. Open VS Code and navigate to the Debug view (Ctrl+Shift+D / Cmd+Shift+D)
2. Select "Debug Frontend in Chrome" from the dropdown menu
3. Click the green play button or press F5 to start debugging
   - This will automatically start the frontend dev server and launch Chrome

### Setting Breakpoints in JavaScript/TypeScript

1. Open a JavaScript or TypeScript file in the frontend source code
2. Click in the gutter to the left of the line numbers where you want to pause execution
3. A red dot will appear indicating a breakpoint

### React-Specific Debugging Tips

#### Component Inspection
1. Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools) in Chrome
2. When debugging, open Chrome DevTools and navigate to the "Components" tab
3. This allows you to inspect component props, state, and the component tree

#### State and Props Debugging
1. Set breakpoints in component render methods or effect hooks
2. When the breakpoint is hit, use the VS Code Variables panel to inspect:
   - `this.state` or the state hook variables
   - `this.props` or props parameter
   - Component instance properties

#### Performance Debugging
1. Use the Performance tab in Chrome DevTools
2. Record performance during specific interactions
3. Analyze component render times and unnecessary re-renders
4. Use the React Profiler in React DevTools to identify slow components

## Full-Stack Debugging

### Debugging Frontend and Backend Together

1. Select the "Full Stack: Frontend & Backend" configuration
2. Click the green play button or press F5
3. This will start both the frontend and backend debuggers simultaneously
4. You can set breakpoints in both Java and JavaScript/TypeScript files
5. The debugger will stop at your breakpoints in either codebase

## Debugging in Docker

### Debugging Backend in Docker

1. Ensure the backend Dockerfile includes the debug agent:
   ```dockerfile
   ENV JAVA_TOOL_OPTIONS "-agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n"
   ```

2. Check that docker-compose.yml exposes port 5005:
   ```yaml
   backend:
     # ...existing configuration...
     ports:
       - "8080:8080"
       - "5005:5005"  # Debug port
   ```

3. Use the "Start Dockerized Backend with Debug" task:
   - Press Ctrl+Shift+P (or Cmd+Shift+P on macOS)
   - Type "Tasks: Run Task" and select "Start Dockerized Backend with Debug"

4. Then use the "Debug Backend in Docker" configuration to connect to it

### Debugging Frontend in Docker

1. Update docker-compose.yml to expose remote debugging:
   ```yaml
   frontend:
     # ...existing configuration...
     ports:
       - "${FRONTEND_PORT}:${FRONTEND_PORT}"
       - "9222:9222"  # Chrome remote debugging port
   ```

2. Use the "Debug Frontend in Docker" configuration to connect to it

## Common Debug Commands

### Keyboard Shortcuts

- **Step Over**: F10 - Execute the current line and move to the next line
- **Step Into**: F11 - Step into a method call
- **Step Out**: Shift+F11 - Complete the current method and return to the caller
- **Continue**: F5 - Resume execution until the next breakpoint
- **Restart**: Ctrl+Shift+F5 - Restart the debugging session
- **Stop**: Shift+F5 - Stop the debugging session

### VS Code Tasks

You can run these tasks from the Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

1. **Start Frontend Dev Server** - Starts the React development server
2. **Start Backend Dev Server** - Starts the Spring Boot application
3. **Start Backend with Remote Debug** - Starts the backend with debug port exposed
4. **Start Dockerized Backend with Debug** - Starts the backend in Docker with debug enabled
5. **Build Backend** - Compiles the backend code
6. **Build Frontend** - Creates a production build of the frontend
7. **Run Backend Tests** - Executes all backend tests
8. **Run Specific Backend Test** - Runs a specific test class
9. **Stop All Tasks** - Terminates all running tasks

## Troubleshooting

### Backend Debugging Issues

#### Cannot connect to remote JVM
- Check that the port (5005) is correctly exposed and not blocked by a firewall
- Verify that the JVM is started with the correct debugging parameters
- Try running `netstat -an | grep 5005` to ensure the port is listening

#### Breakpoints not hitting
- Verify that the source code matches the running code
- Ensure the class is loaded by the JVM when your breakpoint is set
- Try setting a breakpoint in a method you're sure is called

#### Hot Code Replace fails
- Some changes (like adding methods or changing method signatures) require a restart
- Try to limit changes to method bodies during debugging sessions

### Frontend Debugging Issues

#### Debugger Not Connecting
- Ensure Chrome is installed and can be launched from the command line
- Check that the frontend dev server is running on the expected port
- Verify that no other debugging instance of Chrome is running

#### Breakpoints Not Hitting
- Ensure sourcemaps are properly generated (should be enabled by default in React apps)
- Try setting a breakpoint in the `debugger;` statement in your code
- Refresh the page after setting breakpoints

#### Development Server Issues
- Check if the React development server is running
- Verify there are no build errors in the terminal
- Try restarting the development server with `npm start`

### Docker Debugging Issues

#### Container not starting
- Check Docker logs for errors: `docker-compose logs`
- Verify port availability: `lsof -i :5005` and `lsof -i :${FRONTEND_PORT}`
- Ensure Docker daemon is running: `docker info`

#### Debug port not accessible
- Check that port mapping is correctly set in docker-compose.yml
- Verify the JAVA_TOOL_OPTIONS is set correctly in the Dockerfile
- Try exposing the debug port manually: `docker run -p 5005:5005 ...`
