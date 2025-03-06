# Task Management Frontend

This is the frontend component of the Task Management application, built with React.js.

## Frontend Structure

The React application follows a component-based architecture:

```
frontend/
├── public/              # Public assets
├── src/                 # Source files
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Shared components (buttons, inputs, etc.)
│   │   ├── layout/      # Layout components (header, footer, etc.)
│   │   └── task/        # Task-specific components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles and themes
│   ├── App.js           # Main App component
│   └── index.js         # Application entry point
└── package.json         # Dependencies and scripts
```

## Frontend Development

To run the frontend locally for development:

```bash
cd frontend
npm install
npm start
```

This will start the development server and open the application in your default browser at http://localhost:3000.

## Available Scripts

In the frontend directory, you can run:

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run lint`

Runs the linter to check for code quality issues.

## Frontend Testing

### Unit and Component Testing

The frontend uses Jest and React Testing Library for unit and component testing:

```bash
cd frontend
npm test
```

### End-to-End Testing

E2E testing is implemented using Cypress:

```bash
cd frontend
npm run cypress:open
```

## UI Features

The frontend includes the following UI features:

- Responsive design that works on desktop, tablet, and mobile
- Task dashboard with filtering and sorting options
- Calendar view for due date visualization
- User profile management
- Task creation and editing forms
- Priority-based color coding for tasks
- Category filtering and management
- Role-based UI elements and permissions
- Real-time notifications for task changes
- Dark/light theme toggling
- Interactive charts for task statistics
