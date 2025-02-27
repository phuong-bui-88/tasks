import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusBadge = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (due < today) {
      return <Badge bg="danger">Overdue</Badge>;
    } else if (due.toDateString() === today.toDateString()) {
      return <Badge bg="warning">Due Today</Badge>;
    } else {
      return <Badge bg="success">Upcoming</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Tasks List</h2>
        <Link to="/create" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks found. Create a new task to get started.</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{getStatusBadge(task.dueDate)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link to={`/edit/${task.id}`} className="btn btn-sm btn-info">
                      Edit
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TasksList;
