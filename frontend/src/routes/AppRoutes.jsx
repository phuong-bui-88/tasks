import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import CreateTask from "../components/tasks/CreateTask";
import EditTask from "../components/tasks/EditTask";
import TasksList from "../components/tasks/TasksList";
import ProfilePage from "../components/users/ProfilePage";
// import UserForm from "../components/users/UserForm";
// import UserList from "../components/users/UserList";
import { useUser } from "../contexts/UserContext";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  // Get values from UserContext instead of props
  const { isLoggedIn, userData, handleLogout, updateUserProfile } = useUser();

  return (
    <Routes>
      {/* Public Routes - Only accessible when NOT logged in */}
      <Route element={<PublicRoute isLoggedIn={isLoggedIn}><Outlet /></PublicRoute>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Logout route - accessible to everyone */}
      <Route path="/logout" element={<LogoutHandler handleLogout={handleLogout} />} />

      {/* Protected Routes - Only accessible when logged in */}
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn}><Outlet /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard tasks={[]} setTasks={() => { }} />} />

        {/* Task Routes */}
        <Route path="/tasks" element={<TasksList tasks={[]} />} />
        <Route path="/tasks/new" element={<CreateTask setTasks={() => { }} />} />
        <Route path="/tasks/edit/:id" element={<EditTask tasks={[]} setTasks={() => { }} />} />

        {/* Profile Page Route */}
        <Route
          path="/profile"
          element={
            <ProfilePage
              userData={userData}
              updateUserProfile={updateUserProfile}
            />
          }
        />

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