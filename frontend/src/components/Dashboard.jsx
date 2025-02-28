function Dashboard({ tasks, setTasks }) {
    return (
        <div className="dashboard">
            <p>Welcome to your task management application!</p>
            {/* Task management functionality will go here */}
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
