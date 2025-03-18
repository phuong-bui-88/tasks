import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditTask({ tasks, setTasks }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(1); // Default to 1 (PENDING)
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assigneeEmail, setAssigneeEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const task = tasks.find(task => task.id === parseInt(id) || task.id === id);

        if (!task) {
            setNotFound(true);
            return;
        }

        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status || 1);
        setStartDate(task.startDate ? task.startDate.substring(0, 10) : '');
        setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
        setAssigneeEmail(task.assigneeEmail || '');
    }, [id, tasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Format dates for API
            const formattedStartDate = startDate ? `${startDate}T00:00:00` : null;
            const formattedDueDate = dueDate ? `${dueDate}T00:00:00` : null;

            const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if using authentication
                },
                body: JSON.stringify({
                    title,
                    description,
                    startDate: formattedStartDate,
                    status: parseInt(status), // Ensure numeric status
                    dueDate: formattedDueDate,
                    assigneeEmail: assigneeEmail || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update task');
            }

            const updatedTask = await response.json();

            // Update tasks state with the updated task
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );

            // Redirect to home page
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (notFound) {
        return <div className="alert alert-warning mt-4">Task not found</div>;
    }

    return (
        <div className="mt-4">
            <h2>Edit Task</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                {/* Removed Status dropdown section */}

                <div className="mb-3">
                    <label htmlFor="assigneeEmail" className="form-label">Assignee Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="assigneeEmail"
                        value={assigneeEmail}
                        onChange={(e) => setAssigneeEmail(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default EditTask;
