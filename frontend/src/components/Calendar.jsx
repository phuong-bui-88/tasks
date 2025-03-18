import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

function Calendar({ tasks, scrollToTask }) {
    // State for tracking current month/year
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Format date for display and as key - ensure consistent formatting
    const formatDateKey = (date) => {
        if (!date) return "";
        // Ensure the date is standardized by removing time component
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Check if date is today - improved for more accurate comparison
    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Group tasks by date - normalized date formatting
    const tasksByDate = useMemo(() => {
        const grouped = {};

        tasks.forEach(task => {
            if (task.dueDate) {
                // Ensure consistent date key format regardless of original date string format
                const dueDate = new Date(task.dueDate);
                const dateKey = formatDateKey(dueDate);

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(task);
            }
        });

        return grouped;
    }, [tasks]);

    // Debug log to check dates
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Tasks by date:', tasksByDate);
            const today = new Date();
            const todayKey = formatDateKey(today);
            console.log('Today formatted key:', todayKey);
            console.log('Tasks for today:', tasksByDate[todayKey]);
        }
    }, [tasksByDate]);

    // Generate calendar days for current month
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();

        // Create array with empty slots for days from previous month
        const days = Array(firstDayOfWeek).fill(null);

        // Add days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentYear, currentMonth, i));
        }

        return days;
    }, [currentMonth, currentYear]);

    // Check if date is weekend
    const isWeekend = (date) => {
        if (!date) return false;
        const day = date.getDay();
        return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    };

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Go to current month
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Format month and year for header
    const formatMonthYear = (date) => {
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    };

    // Get appropriate style classes - use a consistent color instead of priority-based
    const getTaskDotColor = () => {
        return 'bg-indigo-500';
    };

    // Get task count for a specific date
    const getTaskCount = (date) => {
        if (!date) return 0;
        const dateKey = formatDateKey(date);
        return tasksByDate[dateKey]?.length || 0;
    };

    // Get color for task count badge
    const getTaskCountColor = (count) => {
        if (count === 0) return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        if (count > 2) return 'bg-indigo-500 text-white';
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300';
    };

    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-3 border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">Calendar</h2>
                <div className="flex items-center space-x-1">
                    <button
                        className="p-0.5 rounded hover:bg-indigo-50 dark:hover:bg-gray-700"
                        onClick={prevMonth}
                        aria-label="Previous month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                        {formatMonthYear(currentDate)}
                    </span>
                    <button
                        className="p-0.5 rounded hover:bg-indigo-50 dark:hover:bg-gray-700"
                        onClick={nextMonth}
                        aria-label="Next month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        className="ml-1 px-1.5 py-0.5 text-[8px] font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded"
                        onClick={goToToday}
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Calendar Grid - Super Compact Version */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-7 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                    {weekdays.map((day, index) => (
                        <div key={`day-${index}`} className="text-center py-0.5 text-[8px] font-medium text-indigo-600 dark:text-indigo-400">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 bg-white dark:bg-gray-800">
                    {calendarDays.map((day, index) => {
                        // Use the consistent date formatting for task lookup
                        const dateKey = formatDateKey(day);
                        const taskCount = day ? (tasksByDate[dateKey]?.length || 0) : 0;
                        const isCurrentDate = isToday(day);
                        const isWeekendDay = isWeekend(day);

                        return (
                            <div
                                key={day ? dateKey : `empty-${index}`}
                                className={`
                                    min-h-[38px] max-h-[38px] border-b border-r border-gray-200 dark:border-gray-700 p-0.5
                                    relative group transition-colors duration-150
                                    ${!day ? 'bg-gray-50 dark:bg-gray-900/30' : ''}
                                    ${isWeekendDay ? 'bg-gray-50/50 dark:bg-gray-800/80' : ''}
                                    ${isCurrentDate ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                                    ${index % 7 === 6 ? 'border-r-0' : ''}
                                    last:border-b-0
                                `}
                            >
                                {day && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className={`
                                                text-[8px] font-bold flex items-center justify-center h-4 w-4 rounded-full
                                                ${isCurrentDate ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' :
                                                    isWeekendDay ? 'text-indigo-400 dark:text-indigo-500' : 'text-gray-700 dark:text-gray-300'}
                                            `}>
                                                {day.getDate()}
                                            </span>
                                            {taskCount > 0 && (
                                                <span className={`
                                                    py-0.5 px-0.5 text-[6px] font-bold rounded
                                                    ${getTaskCountColor(taskCount)}
                                                `}>
                                                    {taskCount}
                                                </span>
                                            )}
                                        </div>

                                        {/* Show dots for tasks instead of full task items */}
                                        {taskCount > 0 && (
                                            <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                                                {tasksByDate[dateKey].slice(0, 4).map((task, i) => (
                                                    <div
                                                        key={task.id || i}
                                                        className={`w-1.5 h-1.5 rounded-full cursor-pointer ${getTaskDotColor()}`}
                                                        onClick={() => scrollToTask(task.id)}
                                                        title={task.title}
                                                    />
                                                ))}
                                                {taskCount > 4 && (
                                                    <div className="text-[6px] text-indigo-500 dark:text-indigo-400 font-medium ml-0.5">
                                                        +{taskCount - 4}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

Calendar.propTypes = {
    tasks: PropTypes.array.isRequired,
    scrollToTask: PropTypes.func.isRequired
};

export default Calendar;
