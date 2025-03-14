import React from 'react';
import { useTask } from '../contexts/TaskContext';
import CreateTaskForm from './tasks/CreateTaskForm';
import TasksList from './tasks/TasksList';

function Dashboard() {
    const { tasks, isSubmitting, formError, handleCreateTask, setFormError } = useTask();

    // Get user initials for avatar
    const userInitials = "JS"; // Would normally come from user data

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Task Dashboard</h1>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                        {userInitials}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">My Profile</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Welcome to your task manager</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-5">
                            Organize your tasks, boost productivity, and never miss a deadline. Create and manage your tasks efficiently with our intuitive interface.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Tasks</h4>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{tasks.length}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                        <CreateTaskForm
                            isSubmitting={isSubmitting}
                            formError={formError}
                            handleCreateTask={handleCreateTask}
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Your Tasks</h3>
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-600 rounded-full">
                                {tasks.length}
                            </span>
                        </div>
                        <div className="p-5">
                            <TasksList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
