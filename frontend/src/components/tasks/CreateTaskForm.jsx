import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Icons
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);

function CreateTaskForm({ isSubmitting, formError, handleCreateTask }) {
    const [formData, setFormData] = useState({
        taskTitle: '',
        description: '',
        dueDate: '',
        priority: 'medium'
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle priority change with additional UI feedback
    const handlePriorityChange = (event) => {
        const { value } = event.target;
        setFormData({ ...formData, priority: value });
    };

    const handleTaskSubmit = async (event) => {
        event.preventDefault();
        const result = await handleCreateTask(formData);
        if (result.success) {
            // Reset form
            setFormData({
                taskTitle: '',
                description: '',
                dueDate: '',
                priority: 'medium'
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            {formError && <div className="text-red-500 mb-3">{formError}</div>}
            <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input
                        type="text"
                        id="taskTitle"
                        name="taskTitle"
                        value={formData.taskTitle}
                        onChange={handleInputChange}
                        placeholder="What do you need to do?"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Add more details about this task..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-1/2 mb-4">
                        <label htmlFor="dueDate" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <CalendarIcon /> Due Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Select task deadline</div>
                    </div>

                    <div className="w-full md:w-1/2 mb-4">
                        <label htmlFor="priority" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <FlagIcon /> Priority Level
                        </label>
                        <div className="relative">
                            <div className={`absolute top-1/2 transform -translate-y-1/2 left-3 w-2 h-2 rounded-full ${formData.priority === 'low' ? 'bg-green-500' :
                                formData.priority === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handlePriorityChange}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Set task importance</div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
            </form>
        </div>
    );
}

CreateTaskForm.propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    formError: PropTypes.string,
    handleCreateTask: PropTypes.func.isRequired
};

export default CreateTaskForm;
