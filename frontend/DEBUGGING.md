# Frontend Debugging Guide

This document provides instructions for debugging the React frontend application using Visual Studio Code.

## Prerequisites

1. Install the following VS Code extensions:
   - JavaScript Debugger
   - Chrome Debugger Extension
   - ESLint
   - Prettier (optional but recommended)

2. Make sure your project is opened in VS Code and the extensions have been properly loaded.

## Debug Configurations

We've set up several debug configurations for the frontend:

1. **Debug Frontend in Chrome** - Launches Chrome and attaches the debugger to your React application
2. **Debug Frontend Tests** - Allows you to debug Jest tests for the React components
3. **Full Stack: Frontend & Backend** - Launches both frontend and backend debuggers simultaneously

## How to Debug

### Starting a Debug Session

1. Open VS Code and navigate to the Debug view (Ctrl+Shift+D / Cmd+Shift+D)
2. Select "Debug Frontend in Chrome" from the dropdown menu
3. Click the green play button or press F5 to start debugging
   - This will automatically start the frontend dev server and launch Chrome

### Setting Breakpoints

1. Open a JavaScript or TypeScript file in the frontend source code
2. Click in the gutter to the left of the line numbers where you want to pause execution
3. A red dot will appear indicating a breakpoint

### Using the Browser Developer Tools

The Chrome Debugger extension integrates with the browser's developer tools:

1. You can use the browser console for logging and testing expressions
2. Network requests can be monitored through the Network tab
3. React DevTools extension can be used alongside VS Code debugging

### Debugging CSS and Styling

1. Use the browser's Elements panel to inspect and modify styles in real-time
2. Changes made in the browser can be copied back to your source code

## Debug Tasks

The following tasks are available in VS Code:

1. **Start Frontend Dev Server** - Starts the React development server
2. **Build Frontend** - Creates a production build of the frontend
3. **Stop All Tasks** - Terminates all running tasks

### Running Tasks Manually

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select the task you want to run

## Debugging React Components

### Component Inspection

1. Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools) in Chrome
2. When debugging, open Chrome DevTools and navigate to the "Components" tab
3. This allows you to inspect component props, state, and the component tree

### State and Props Debugging

1. Set breakpoints in component render methods or effect hooks
2. When the breakpoint is hit, use the VS Code Variables panel to inspect:
   - `this.state` or the state hook variables
   - `this.props` or props parameter
   - Component instance properties

## Debugging Tests

To debug frontend tests:

1. Select the "Debug Frontend Tests" configuration
2. Set breakpoints in your test files or component code
3. Press F5 to start the test debugger
4. Tests will run in watch mode, and the debugger will stop at your breakpoints

## Troubleshooting

### Debugger Not Connecting

- Ensure Chrome is installed and can be launched from the command line
- Check that the frontend dev server is running on the expected port
- Verify that no other debugging instance of Chrome is running

### Breakpoints Not Hitting

- Ensure sourcemaps are properly generated (should be enabled by default in React apps)
- Try setting a breakpoint in the `debugger;` statement in your code
- Refresh the page after setting breakpoints

### Development Server Issues

- Check if the React development server is running
- Verify there are no build errors in the terminal
- Try restarting the development server with `npm start`

## Performance Debugging

For debugging performance issues:

1. Use the Performance tab in Chrome DevTools
2. Record performance during specific interactions
3. Analyze component render times and unnecessary re-renders
4. Use the React Profiler in React DevTools to identify slow components

## Remote Debugging

To debug the frontend running in Docker:

1. Update docker-compose.yml to expose remote debugging:

```yaml
frontend:
  # ...existing configuration...
  ports:
    - "${FRONTEND_PORT}:${FRONTEND_PORT}"
    - "9222:9222"  # Chrome remote debugging port
  command: >
    sh -c "npm start"
```

2. Create a new debug configuration in launch.json:

```json
{
  "type": "chrome",
  "request": "attach",
  "name": "Debug Frontend in Docker",
  "port": 9222,
  "webRoot": "${workspaceFolder}/frontend/src",
  "urlFilter": "http://localhost:*",
  "sourceMapPathOverrides": {
    "webpack:///src/*": "${webRoot}/*"
  }
}
```
