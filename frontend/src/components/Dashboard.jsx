import React, { useRef, useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import Calendar from './Calendar';
import QuickNavigation from './QuickNavigation';
import CreateTaskForm from './tasks/CreateTaskForm';
import TasksList from './tasks/TasksList';

function Dashboard() {
    const { tasks, isSubmitting, formError, handleCreateTask, setFormError } = useTask();
    const quickNavRef = useRef(null);
    const [activeTaskId, setActiveTaskId] = useState(null);

    // Get user initials for avatar
    const userInitials = "JS"; // Would normally come from user data

    // Function to handle smooth scrolling to a task and activating it
    const scrollToTask = (taskId) => {
        const element = document.getElementById(`task-${taskId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveTaskId(taskId); // Set this task as active
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Task Dashboard</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">Manage your tasks efficiently</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Settings
                    </button>
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-lg transform group-hover:scale-105 transition-transform">
                            {userInitials}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">My Profile</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    {/* Welcome card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-gray-700">
                        {/* Welcome card content */}
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Welcome to your task manager</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            Organize your tasks, boost productivity, and never miss a deadline. Create and manage your tasks efficiently with our intuitive interface.
                        </p>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-5 transform transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tasks</h4>
                                <div className="bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs text-gray-500 dark:text-gray-400">Today</div>
                            </div>
                            <div className="flex items-end mt-2">
                                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{tasks.length}</p>
                                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400 pb-1">active tasks</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="sticky top-6 z-20">
                        <QuickNavigation
                            tasks={tasks}
                            activeTaskId={activeTaskId}
                            scrollToTask={scrollToTask}
                            quickNavRef={quickNavRef}
                        />
                    </div>

                    {/* Calendar */}
                    <div>
                        <Calendar
                            tasks={tasks}
                            scrollToTask={scrollToTask}
                        />
                    </div>
                </div>

                {/* Right column - create task and tasks list */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                        <div className="flex items-center mb-4 p-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Task</h2>
                        </div>
                        <div className="px-6 pb-6">
                            <CreateTaskForm
                                isSubmitting={isSubmitting}
                                formError={formError}
                                handleCreateTask={handleCreateTask}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Tasks</h3>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-indigo-100 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-sm">
                                    {tasks.length}
                                </span>
                                <select className="text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-transparent">
                                    <option>All Tasks</option>
                                    <option>Completed</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6">
                            <TasksList activeTaskId={activeTaskId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
