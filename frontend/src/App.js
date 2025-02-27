import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import Header from './components/Header';
import TasksList from './components/TasksList';

function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<TasksList />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
