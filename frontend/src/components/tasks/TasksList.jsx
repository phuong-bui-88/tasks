import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';

function TasksList() {
  const { 
    tasks,
    loading,
    error
  } = useTask();

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center my-5">
        <div className="empty-state">
          <i className="bi bi-clipboard-check fs-1 text-muted"></i>
          <p className="mt-3 text-muted">You have no tasks yet. Add one using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TasksList;
