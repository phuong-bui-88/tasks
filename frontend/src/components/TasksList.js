import React from 'react';
import { Link } from 'react-router-dom';

function TasksList({ tasks }) {
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks List</h2>
        <Link to="/create" className="btn btn-primary">Create New Task</Link>
      </div>
      
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="list-group task-list">
          {tasks.map(task => (
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch(status.toLowerCase()) {
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
