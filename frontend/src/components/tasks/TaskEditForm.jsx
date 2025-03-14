import PropTypes from 'prop-types';
import React from 'react';

function TaskEditForm({ editFormData, isSubmitting, onEditFormChange, onUpdateTask, onCancelEdit }) {

    return (
        <div className="bg-white rounded-lg p-4 shadow-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h5 className="text-lg font-semibold text-gray-800">Edit Task</h5>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onCancelEdit}
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <form onSubmit={onUpdateTask} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="editTitle">Title</label>
                    <input
                        type="text"
                        id="editTitle"
                        name="title"
                        value={editFormData.title}
                        onChange={onEditFormChange}
                        placeholder="Task title"
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="editDescription">Description</label>
                    <textarea
                        id="editDescription"
                        name="description"
                        value={editFormData.description}
                        onChange={onEditFormChange}
                        placeholder="Task description"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows="3"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="editDueDate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
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
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Select task deadline</p>
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="editPriority">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            Priority
                        </label>
                        <div className="relative">
                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${editFormData.priority === 'low' ? 'bg-green-500' :
                                    editFormData.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'
                                }`}></div>
                            <select
                                id="editPriority"
                                name="priority"
                                value={editFormData.priority}
                                onChange={onEditFormChange}
                                className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Set task importance</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="editStatus">Status</label>
                    <div className="relative">
                        <select
                            id="editStatus"
                            name="status"
                            value={editFormData.status}
                            onChange={onEditFormChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                        >
                            <option value="TODO">Todo</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
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
