import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import NotFound from '../components/NotFound';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Task Routes */}
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/edit/:id" element={<TaskForm editMode={true} />} />
        
        {/* User Routes */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm editMode={true} />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
