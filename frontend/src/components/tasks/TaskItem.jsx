import PropTypes from 'prop-types';
import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskEditForm from './TaskEditForm';

// Calendar icon component
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

function TaskItem({ task, className = '' }) {
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

    // Get status badge class based on status
    const getStatusBadgeClass = (status) => {
        // Handle numeric status values from the API
        const numericStatus = typeof status === 'number' ? status : parseInt(status);
        switch (numericStatus) {
            case 2: return 'bg-green-100 text-green-700'; // COMPLETED
            case 1: return 'bg-yellow-100 text-yellow-700'; // PENDING
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status display text
    const getStatusText = (status) => {
        // Handle numeric status values from the API
        const numericStatus = typeof status === 'number' ? status : parseInt(status);
        switch (numericStatus) {
            case 1: return 'Pending';
            case 2: return 'Completed';
            default: return 'Unknown';
        }
    };

    // Active task styling
    const isActive = className.includes('active-task');

    return (
        <li
            id={`task-${task.id}`}
            className={`bg-white rounded-lg shadow-sm mb-4 p-5 transition-all duration-200 border-l-4 
                border-l-gray-300
                ${isActive ? 'ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-1 transform scale-[1.02]' : ''}
                ${className}`}
        >
            {isEditing ? (
                <TaskEditForm
                    editFormData={editFormData}
                    isSubmitting={isSubmitting}
                    onEditFormChange={handleEditFormChange}
                    onUpdateTask={handleUpdateTask}
                    onCancelEdit={handleCancelEdit}
                />
            ) : (
                <div className="relative">
                    {/* Highlight indicator for active task */}
                    {isActive && (
                        <div className="absolute -right-2 -top-2 h-4 w-4 bg-indigo-500 rounded-full border-2 border-white" />
                    )}

                    {/* Task content */}
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="m-0 text-lg font-semibold text-gray-800 flex-1">{task.title}</h4>
                    </div>

                    {task.description && <p className="text-gray-600 mb-4 text-[0.95rem] leading-normal">{task.description}</p>}

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        {task.startDate && (
                            <p className="flex items-center gap-1">
                                <CalendarIcon /> Start: {formatDate(task.startDate)}
                            </p>
                        )}
                        {task.dueDate && (
                            <p className="flex items-center gap-1">
                                <CalendarIcon /> Due: {formatDate(task.dueDate)}
                            </p>
                        )}
                        {task.status && (
                            <p className="flex items-center gap-1">
                                Status: <span className={`py-0.5 px-1.5 rounded text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                                    {getStatusText(task.status)}
                                </span>
                            </p>
                        )}
                        {task.assigneeEmail && (
                            <p className="flex items-center gap-1">
                                Assigned to: <span className="font-medium">{task.assigneeEmail}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors"
                            onClick={() => handleEditClick(task)}
                            aria-label="Edit task"
                        >
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l13-13zM5 17.586V19h1.414l12.293-12.293-1.414-1.414L5 17.586z" />
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button
                            className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 text-sm transition-colors"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                        >
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
    task: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default TaskItem;
