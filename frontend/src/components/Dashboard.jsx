import React from 'react';
import './Dashboard.css'; // Uncomment this as we'll create this file

function Dashboard({ tasks, setTasks }) {
    const handleAddTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    const handleTaskSubmit = (event) => {
        event.preventDefault();
        const newTaskTitle = event.target.elements.taskTitle.value;
        if (newTaskTitle) {
            handleAddTask({ title: newTaskTitle });
            event.target.reset();
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Task Dashboard</h1>
            </header>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>Welcome to your task management application!</h2>
                    <p>Manage your tasks efficiently and stay organized.</p>
                </div>

                <div className="task-manager">
                    <h3>Add New Task</h3>
                    <form onSubmit={handleTaskSubmit} className="task-form">
                        <input
                            type="text"
                            name="taskTitle"
                            placeholder="New task title"
                            required
                            className="task-input"
                        />
                        <button type="submit" className="add-button">Add Task</button>
                    </form>

                    <div className="task-list-container">
                        <h3>Your Tasks</h3>
                        {tasks.length === 0 ? (
                            <p className="empty-task-message">No tasks yet. Add your first task!</p>
                        ) : (
                            <ul className="task-list">
                                {tasks.map((task, index) => (
                                    <li key={index} className="task-item">{task.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
