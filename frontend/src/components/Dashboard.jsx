import React from 'react';
// import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';


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
        <div className="dashboard">
            <p>Welcome to your task management application!</p>
            {/* Task management functionality will go here */}
            <form onSubmit={handleTaskSubmit}>
                <input type="text" name="taskTitle" placeholder="New task title" required />
                <button type="submit">Add Task</button>
            </form>
            <div className="task-list">
                {tasks.length === 0 ? (
                    <p>No tasks yet. Add your first task!</p>
                ) : (
                    <ul>
                        {tasks.map((task, index) => (
                            <li key={index}>{task.title}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
