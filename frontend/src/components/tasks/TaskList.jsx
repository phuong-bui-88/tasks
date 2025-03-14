import React from 'react';

const TaskList = ({ tasks }) => {
    // Function to get priority classes
    const getPriorityClasses = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-l-4 border-red-500';
            case 'medium':
                return 'border-l-4 border-orange-500';
            case 'low':
                return 'border-l-4 border-green-500';
            default:
                return 'border-l-4 border-gray-300';
        }
    };

    // Function to get priority badge classes
    const getPriorityBadgeClasses = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border border-orange-300';
            case 'low':
                return 'bg-green-100 text-green-800 border border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    // Function to get status badge classes
    const getStatusBadgeClasses = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <ul className="list-none p-0 m-0">
            {tasks.length === 0 ? (
                <div className="text-center py-10 px-4">
                    <div className="text-gray-400 text-3xl mb-2">📝</div>
                    <p className="text-gray-500 italic">No tasks found. Create your first task!</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <li
                        key={task.id}
                        className={`bg-white rounded-lg shadow-sm hover:shadow-md mb-4 p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${getPriorityClasses(task.priority)}`}
                    >
                        <div className="relative">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-semibold text-gray-800 flex-1 m-0">{task.title}</h4>
                                <div className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getPriorityBadgeClasses(task.priority)}`}>
                                    <span className="inline-block w-2 h-2 rounded-full mr-1.5"
                                        style={{
                                            backgroundColor:
                                                task.priority === 'high' ? '#e74c3c' :
                                                    task.priority === 'medium' ? '#f39c12' :
                                                        '#27ae60'
                                        }}></span>
                                    {task.priority}
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{task.description}</p>

                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                {task.dueDate && (
                                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                        <span className="text-sm">📅</span>
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}

                                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(task.status)}`}>
                                    {task.status}
                                </div>

                                {task.assignee && (
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <span className="text-sm">👤</span>
                                        <span>{task.assignee}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))
            )}
        </ul>
    );
};

export default TaskList;
