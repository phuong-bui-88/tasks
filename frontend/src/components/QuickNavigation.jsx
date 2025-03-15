import React from 'react';

function QuickNavigation({ tasks, activeTaskId, scrollToTask, quickNavRef }) {
    if (tasks.length === 0) return null;

    return (
        <div
            ref={quickNavRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-gray-700 relative"
        >
            <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Navigation</h2>
            </div>

            <div className="mt-3 space-y-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                    <button
                        key={task.id}
                        onClick={() => scrollToTask(task.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors flex items-center group
                            ${task.id === activeTaskId
                                ? 'bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                    >
                        <span className={`w-2 h-2 rounded-full mr-2 ${task.id === activeTaskId
                            ? 'bg-indigo-600'
                            : 'bg-indigo-400 group-hover:bg-indigo-600'}`}></span>
                        <span className="truncate">{task.title}</span>
                    </button>
                ))}
                {tasks.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No tasks available</p>
                )}
            </div>
        </div>
    );
}

export default QuickNavigation;
