import React, { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task);
        setTask({
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>

            {/* Title field */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="w-1 h-3.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded mr-2"></span>
                    Task Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white shadow-sm text-gray-800"
                    placeholder="Enter task title"
                />
            </div>

            {/* Description field */}
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="w-1 h-3.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded mr-2"></span>
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white shadow-sm text-gray-800 min-h-[120px] resize-y"
                    placeholder="Enter task description"
                />
            </div>

            {/* Due Date and Priority row */}
            <div className="flex flex-wrap gap-5 mb-4">
                {/* Due Date field */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="w-1 h-3.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded mr-2"></span>
                        Due Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white shadow-sm text-gray-800 pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            📅
                        </span>
                    </div>
                </div>

                {/* Priority field */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="w-1 h-3.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded mr-2"></span>
                        Priority Level
                    </label>
                    <div className="relative">
                        <select
                            id="priority"
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white shadow-sm text-gray-800 appearance-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                            style={{
                                backgroundColor:
                                    task.priority === 'high' ? '#e74c3c' :
                                        task.priority === 'medium' ? '#f39c12' :
                                            '#27ae60'
                            }}>
                        </span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            ▼
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
