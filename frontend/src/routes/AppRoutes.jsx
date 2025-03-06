import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import CreateTask from "../components/tasks/CreateTask";
import EditTask from "../components/tasks/EditTask";
import TasksList from "../components/tasks/TasksList";
import UserForm from "../components/users/UserForm";
import UserList from "../components/users/UserList";
import ProtectedRoute from "./ProtectedRoute";

interface AppRoutesProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  handleLogin?: (credentials: {
    username: string;
    password: string;
  }) => boolean;
  handleLogout?: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  handleLogin,
  handleLogout,
}) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login setIsLoggedIn={setIsLoggedIn} handleLogin={handleLogin} />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/logout"
        element={<LogoutHandler handleLogout={handleLogout} />}
      />

      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Task Routes */}
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />

        {/* User Routes */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm editMode={true} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Simple LogoutHandler component to handle logout and redirect
const LogoutHandler: React.FC<{ handleLogout?: () => void }> = ({
  handleLogout,
}) => {
  React.useEffect(() => {
    if (handleLogout) {
      handleLogout();
    }
  }, [handleLogout]);

  return <Navigate to="/login" />;
};

export default AppRoutes;
