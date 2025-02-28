import { useState } from 'react';

function App() {
    const [tasks, setTasks] = useState([]);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Task Management App</h1>
            </header>
            <main>
                <p>Welcome to your task management application!</p>
            </main>
        </div>
    );
}

export default App;
