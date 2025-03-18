import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

// Function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

function TaskEditForm({ editFormData, isSubmitting, onEditFormChange, onUpdateTask, onCancelEdit }) {
    // Set default dates if not provided
    useEffect(() => {
        const todayDate = getTodayDateString();

        // Check if dates are missing and set defaults if needed
        if (!editFormData.startDate) {
            onEditFormChange({
                target: { name: 'startDate', value: todayDate }
            });
        }

        if (!editFormData.dueDate) {
            onEditFormChange({
                target: { name: 'dueDate', value: todayDate }
            });
        }
    }, []);

    return (
        <div className="bg-white rounded-lg p-5 shadow-lg animate-fadeIn border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h5 className="text-xl font-bold text-gray-800">Edit Task</h5>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={onCancelEdit}
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <form onSubmit={onUpdateTask} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="editTitle">Task Title</label>
                    <input
                        type="text"
                        id="editTitle"
                        name="title"
                        value={editFormData.title}
                        onChange={onEditFormChange}
                        placeholder="Task title"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="editDescription">Description</label>
                    <textarea
                        id="editDescription"
                        name="description"
                        value={editFormData.description}
                        onChange={onEditFormChange}
                        placeholder="Task description"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                        rows="4"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5" htmlFor="editStartDate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-blue-500">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Start Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="editStartDate"
                                name="startDate"
                                value={editFormData.startDate}
                                onChange={onEditFormChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">When will you start this task</p>
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-1.5" htmlFor="editDueDate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-blue-500">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Due Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="editDueDate"
                                name="dueDate"
                                value={editFormData.dueDate}
                                onChange={onEditFormChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Select task deadline</p>
                    </div>
                </div>

                {/* Removed Priority and Status UI sections */}

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 align-[-1px]"></span>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

TaskEditForm.propTypes = {
    editFormData: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onEditFormChange: PropTypes.func.isRequired,
    onUpdateTask: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired
};

export default TaskEditForm;
