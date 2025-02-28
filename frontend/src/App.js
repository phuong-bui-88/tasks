import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import Header from './components/Header';
import TasksList from './components/TasksList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <Router>
      <div className="container">
        <Header />
        {loading ? (
          <div className="text-center mt-5">Loading tasks...</div>
        ) : error ? (
          <div className="alert alert-danger mt-3">Error: {error}</div>
        ) : (
          <Routes>
            <Route path="/" element={<TasksList tasks={tasks} onDelete={deleteTask} />} />
            <Route path="/create" element={<CreateTask onAdd={addTask} />} />
            <Route path="/edit/:id" element={<EditTask tasks={tasks} onUpdate={updateTask} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
