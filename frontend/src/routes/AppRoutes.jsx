import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import CreateTask from "../components/tasks/CreateTask";
import EditTask from "../components/tasks/EditTask";
import TasksList from "../components/tasks/TasksList";
// import UserForm from "../components/users/UserForm";
// import UserList from "../components/users/UserList";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = ({
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
          <Login setIsLoggedIn={setIsLoggedIn} />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/logout"
        element={<LogoutHandler handleLogout={handleLogout} />}
      />

      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn}><Outlet /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard tasks={[]} setTasks={() => { }} />} />

        {/* Task Routes */}
        <Route path="/tasks" element={<TasksList tasks={[]} />} />
        <Route path="/tasks/new" element={<CreateTask setTasks={() => { }} />} />
        <Route path="/tasks/edit/:id" element={<EditTask tasks={[]} setTasks={() => { }} />} />

        {/* User Routes */}
        {/* <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm editMode={true} />} /> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Simple LogoutHandler component to handle logout and redirect
const LogoutHandler = ({ handleLogout }) => {
  React.useEffect(() => {
    if (handleLogout) {
      handleLogout();
    }
  }, [handleLogout]);

  return <Navigate to="/login" />;
};

export default AppRoutes;