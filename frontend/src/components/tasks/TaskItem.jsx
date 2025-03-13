import PropTypes from 'prop-types';
import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskEditForm from './TaskEditForm';
import './TaskItem.css';

// Calendar icon component
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

function TaskItem({ task }) {
    const {
        editingTaskId,
        editFormData,
        isSubmitting,
        handleEditClick,
        handleDeleteTask,
        handleCancelEdit,
        handleEditFormChange,
        handleUpdateTask
    } = useTask();

    const isEditing = editingTaskId === task.id;

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get priority label with proper formatting
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'low': return 'Low Priority';
            case 'medium': return 'Medium Priority';
            case 'high': return 'High Priority';
            default: return 'Medium Priority';
        }
    };

    // Get status badge class based on status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'COMPLETED': return 'status-badge-success';
            case 'IN_PROGRESS': return 'status-badge-info';
            case 'TODO': return 'status-badge-warning';
            default: return 'status-badge-secondary';
        }
    };

    return (
        <li className={`task-item`}>
            {isEditing ? (
                <TaskEditForm
                    editFormData={editFormData}
                    isSubmitting={isSubmitting}
                    onEditFormChange={handleEditFormChange}
                    onUpdateTask={handleUpdateTask}
                    onCancelEdit={handleCancelEdit}
                />
            ) : (
                <div className="task-content">
                    <div className="task-header">
                        <h4>{task.title}</h4>
                        <span className={`priority-badge priority-${task.priority?.toLowerCase() || 'medium'}`}>
                            {getPriorityLabel(task.priority?.toLowerCase() || 'medium')}
                        </span>
                    </div>

                    {task.description && <p className="task-description">{task.description}</p>}

                    <div className="task-meta">
                        {task.dueDate && (
                            <p className="task-due-date">
                                <CalendarIcon /> {formatDate(task.dueDate)}
                            </p>
                        )}
                        {task.status && (
                            <p className="task-status">
                                Status: <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                            </p>
                        )}
                        {task.assigneeEmail && (
                            <p className="task-assignee">
                                Assigned to: <span className="assignee">{task.assigneeEmail}</span>
                            </p>
                        )}
                    </div>

                    <div className="task-actions">
                        <button
                            className="action-button edit-button"
                            onClick={() => handleEditClick(task)}
                            aria-label="Edit task"
                        >
                            <svg className="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l13-13zM5 17.586V19h1.414l12.293-12.293-1.414-1.414L5 17.586z" />
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button
                            className="action-button delete-button"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                        >
                            <svg className="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}

TaskItem.propTypes = {
    task: PropTypes.object.isRequired
};

export default TaskItem;
