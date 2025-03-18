/**
 * Service for handling task-related API requests
 */
import apiClient from './apiClient';

const BASE_PATH = '/tasks';

/**
 * Format date strings to ensure they have a time component
 * @param {string|null} dateString - The date string to format
 * @returns {string|null} - Formatted date string with time component or null
 */
const formatDateForApi = (dateString) => {
    if (!dateString) return null;

    // Check if the date string already has a time component
    if (dateString.includes('T')) {
        return dateString;
    }

    // Add a default time (12:00:00) to the date string
    return `${dateString}T12:00:00`;
};

// Fetch all tasks
export const getAllTasks = async () => {
    try {
        const response = await apiClient.get(BASE_PATH);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch a single task by ID
export const getTaskById = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        // Format dates before sending to API
        const formattedTaskData = {
            ...taskData,
            startDate: formatDateForApi(taskData.startDate),
            dueDate: formatDateForApi(taskData.dueDate),
            reminderDate: formatDateForApi(taskData.reminderDate)
        };

        const response = await apiClient.post(BASE_PATH, formattedTaskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing task
export const updateTask = async (id, taskData) => {
    try {
        // Format dates before sending to API
        const formattedTaskData = {
            ...taskData,
            startDate: formatDateForApi(taskData.startDate),
            dueDate: formatDateForApi(taskData.dueDate),
            reminderDate: formatDateForApi(taskData.reminderDate)
        };

        const response = await apiClient.put(`${BASE_PATH}/${id}`, formattedTaskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a task
export const deleteTask = async (id) => {
    try {
        await apiClient.delete(`${BASE_PATH}/${id}`);
        return true;
    } catch (error) {
        throw error;
    }
};

// Get tasks by status
export const getTasksByStatus = async (status) => {
    try {
        const response = await apiClient.get(`${BASE_PATH}/status/${status}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get tasks by assignee
export const getTasksByAssignee = async (email) => {
    try {
        const response = await apiClient.get(`${BASE_PATH}/assignee/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
