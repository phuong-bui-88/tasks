import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTask, deleteTask, getAllTasks, updateTask } from '../services/taskService';

// Create context
const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: ''
    });

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Function to fetch tasks from API
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await getAllTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle task creation
    const handleCreateTask = async (formData) => {
        const { taskTitle, description, dueDate } = formData;

        if (taskTitle) {
            setIsSubmitting(true);
            setFormError(null);

            try {
                // Create task payload based on backend API requirements
                const taskPayload = {
                    title: taskTitle,
                    description,
                    dueDate: dueDate || null,
                    status: 1 // Default status is 1 (PENDING)
                    // completed field removed
                };

                // Call the API to create the task
                const createdTask = await createTask(taskPayload);

                // Add the created task to the UI
                setTasks([...tasks, createdTask]);

                return { success: true, task: createdTask };
            } catch (error) {
                console.error('Failed to create task:', error);
                setFormError(error.userMessage || 'Failed to create task. Please try again.');
                return { success: false, error };
            } finally {
                setIsSubmitting(false);
            }
        }
        return { success: false, error: 'Task title is required' };
    };

    // Function to handle edit button click
    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditFormData({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            status: task.status || 'TODO'
        });
    };

    // Function to handle cancel edit
    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditFormData({
            title: '',
            description: '',
            dueDate: '',
            status: 'TODO'
        });
    };

    // Function to handle edit form input changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // Function to handle edit form submission
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editingTaskId) return;

        setIsSubmitting(true);
        try {
            const taskPayload = {
                title: editFormData.title,
                description: editFormData.description,
                dueDate: editFormData.dueDate || null,
                status: editFormData.status
            };

            const updatedTask = await updateTask(editingTaskId, taskPayload);

            // Update task in the state
            setTasks(tasks.map(task =>
                task.id === editingTaskId ? updatedTask : task
            ));

            // Reset edit state
            setEditingTaskId(null);
            setFormError(null);

            return { success: true, task: updatedTask };
        } catch (error) {
            console.error('Failed to update task:', error);
            setFormError(error.userMessage || 'Failed to update task. Please try again.');
            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle task deletion
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                // Remove task from state
                setTasks(tasks.filter(task => task.id !== taskId));
                return { success: true };
            } catch (error) {
                console.error('Failed to delete task:', error);
                setFormError(error.userMessage || 'Failed to delete task. Please try again.');
                return { success: false, error };
            }
        }
        return { success: false, cancelled: true };
    };

    // Context value
    const value = {
        tasks,
        loading,
        error,
        isSubmitting,
        formError,
        editingTaskId,
        editFormData,
        fetchTasks,
        handleCreateTask,
        handleEditClick,
        handleCancelEdit,
        handleEditFormChange,
        handleUpdateTask,
        handleDeleteTask,
        setFormError
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook for using the context
export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }

    return context;
};

export default TaskContext;
