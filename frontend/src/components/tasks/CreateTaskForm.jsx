import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Icons
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
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
        <div className="p-5 bg-white rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Add New Task</h3>
            {formError && <div className="text-red-500 mb-3 p-2 bg-red-50 rounded-md text-sm">{formError}</div>}
            <form onSubmit={handleTaskSubmit} className="space-y-5">
                <div>
                    <label htmlFor="taskTitle" className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title</label>
                    <input
                        type="text"
                        id="taskTitle"
                        name="taskTitle"
                        value={formData.taskTitle}
                        onChange={handleInputChange}
                        placeholder="What do you need to do?"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Add more details about this task..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                        rows="4"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <CalendarIcon /> Due Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Select task deadline</div>
                    </div>

                    <div>
                        <label htmlFor="priority" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <FlagIcon /> Priority Level
                        </label>
                        <div className="relative">
                            <div className={`absolute top-1/2 transform -translate-y-1/2 left-4 w-3 h-3 rounded-full ${formData.priority === 'low' ? 'bg-green-500' :
                                    formData.priority === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handlePriorityChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 appearance-none"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Set task importance</div>
                    </div>
                </div>

                <div className="pt-4 mt-2">
                    <button
                        type="submit"
                        className={`w-full py-2.5 px-4 rounded-lg text-white font-medium shadow-sm transition-all duration-200 ${isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                Creating...
                            </span>
                        ) : 'Create Task'}
                    </button>
                </div>
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
