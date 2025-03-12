import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TasksList({ tasks, setTasks }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeEmail] = useState('');

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add Authorization header if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        // Update tasks state by removing the deleted task
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      } catch (error) {
        alert('Error deleting task: ' + error.message);
      }
    }
  };

  // Filter tasks based on status and assignee filters
  const filteredTasks = tasks.filter(task => {
    // Apply status filter if selected
    if (statusFilter && task.status !== statusFilter) {
      return false;
    }

    // Apply assignee filter if entered
    if (assigneeFilter && (!task.assigneeEmail || !task.assigneeEmail.toLowerCase().includes(assigneeFilter.toLowerCase()))) {
      return false;
    }

    return true;
  });

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks List</h2>
        <Link to="/create" className="btn btn-primary">Create New Task</Link>
      </div>

      {/* Filter controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
          <select
            id="statusFilter"
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="assigneeFilter" className="form-label">Filter by Assignee</label>
          <input
            type="text"
            id="assigneeFilter"
            className="form-control"
            placeholder="Enter email"
            value={assigneeFilter}
            onChange={(e) => setAssigneeEmail(e.target.value)}
          />
        </div>
        {(statusFilter || assigneeFilter) && (
          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setStatusFilter('');
                setAssigneeEmail('');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="list-group task-list">
          {filteredTasks.map(task => (
            <li key={task.id} className="list-group-item task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-details">
                <span className={`badge bg-${getStatusColor(task.status)}`}>Status: {task.status}</span>
                {task.dueDate && <span className="ms-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                {task.assigneeEmail && <span className="ms-2">Assigned to: {task.assigneeEmail}</span>}
              </div>
              <div className="mt-2">
                <Link to={`/edit/${task.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'in progress':
      return 'info';
    default:
      return 'secondary';
  }
}

export default TasksList;
