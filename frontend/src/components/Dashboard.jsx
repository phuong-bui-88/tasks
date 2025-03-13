import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import './Dashboard.css';
import TasksList from './tasks/TasksList';

// Icons
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);

function Dashboard() {
    const { tasks, isSubmitting, formError, handleCreateTask, setFormError } = useTask();
    const [formData, setFormData] = useState({
        taskTitle: '',
        description: '',
        dueDate: '',
        priority: 'medium'
    });

    // Get user initials for avatar
    const userInitials = "JS"; // Would normally come from user data

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle priority change with additional UI feedback
    const handlePriorityChange = (event) => {
        const { value } = event.target;
        setFormData({ ...formData, priority: value });
    };

    const handleTaskSubmit = async (event) => {
        event.preventDefault();
        const result = await handleCreateTask(formData);
        if (result.success) {
            // Reset form
            setFormData({
                taskTitle: '',
                description: '',
                dueDate: '',
                priority: 'medium'
            });
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Task Dashboard</h1>
                <div className="profile-section">
                    <div className="user-avatar">{userInitials}</div>
                    <span className="profile-text">My Profile</span>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>Welcome to your task manager</h2>
                    <p>Organize your tasks, boost productivity, and never miss a deadline. Create and manage your tasks efficiently with our intuitive interface.</p>

                    <div className="stats-section">
                        <div className="stat-item">
                            <h4>Total Tasks</h4>
                            <p className="stat-number">{tasks.length}</p>
                        </div>
                    </div>
                </div>

                <div className="task-manager">
                    <h3>Add New Task</h3>
                    {formError && <div className="error-message">{formError}</div>}
                    <form onSubmit={handleTaskSubmit} className="task-form">
                        <div className="form-group">
                            <label htmlFor="taskTitle">Task Title</label>
                            <input
                                type="text"
                                id="taskTitle"
                                name="taskTitle"
                                value={formData.taskTitle}
                                onChange={handleInputChange}
                                placeholder="What do you need to do?"
                                required
                                className="task-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Add more details about this task..."
                                className="task-textarea"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half-width date-field">
                                <label htmlFor="dueDate" className="field-label">
                                    <CalendarIcon /> Due Date
                                </label>
                                <div className="date-field-container">
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className="task-input"
                                    />
                                </div>
                                <div className="field-decoration">Select task deadline</div>
                            </div>

                            <div className="form-group half-width priority-field">
                                <label htmlFor="priority" className="field-label">
                                    <FlagIcon /> Priority Level
                                </label>
                                <div className="priority-field-wrapper">
                                    <div className={`priority-indicator ${formData.priority}`}></div>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handlePriorityChange}
                                        className="task-select with-indicator"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <div className="field-decoration">Set task importance</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="add-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </form>

                    <div className="task-list-container">
                        <div className="task-list-header">
                            <h3>Your Tasks</h3>
                            <span className="task-count">{tasks.length}</span>
                        </div>

                        <TasksList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
