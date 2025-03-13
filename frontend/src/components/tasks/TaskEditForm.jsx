import PropTypes from 'prop-types';
import React from 'react';
import './TaskEditForm.css';

function TaskEditForm({ editFormData, isSubmitting, onEditFormChange, onUpdateTask, onCancelEdit }) {

    return (
        <div className="edit-task-form">
            <div className="form-header">
                <h5 className="form-title">Edit Task</h5>
                <button
                    type="button"
                    className="close-button"
                    onClick={onCancelEdit}
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <form onSubmit={onUpdateTask}>
                <div className="edit-form-group">
                    <label className="form-label" htmlFor="editTitle">Title</label>
                    <input
                        type="text"
                        id="editTitle"
                        name="title"
                        value={editFormData.title}
                        onChange={onEditFormChange}
                        placeholder="Task title"
                        required
                        className="task-input"
                    />
                </div>

                <div className="edit-form-group">
                    <label className="form-label" htmlFor="editDescription">Description</label>
                    <textarea
                        id="editDescription"
                        name="description"
                        value={editFormData.description}
                        onChange={onEditFormChange}
                        placeholder="Task description"
                        className="task-textarea"
                        rows="3"
                    />
                </div>

                <div className="form-row">
                    <div className="edit-form-group half-width">
                        <label className="form-label" htmlFor="editDueDate">Due Date</label>
                        <div className="input-with-icon">
                            <input
                                type="date"
                                id="editDueDate"
                                name="dueDate"
                                value={editFormData.dueDate}
                                onChange={onEditFormChange}
                                className="form-control"
                            />
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                    </div>

                    <div className="edit-form-group half-width">
                        <label className="form-label" htmlFor="editPriority">Priority</label>
                        <div className="priority-selector">
                            <select
                                id="editPriority"
                                name="priority"
                                value={editFormData.priority}
                                onChange={onEditFormChange}
                                className="form-control"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <div className={`priority-indicator`}></div>
                        </div>
                    </div>
                </div>

                <div className="edit-form-group">
                    <label className="form-label" htmlFor="editStatus">Status</label>
                    <div className="custom-select">
                        <select
                            id="editStatus"
                            name="status"
                            value={editFormData.status}
                            onChange={onEditFormChange}
                            className="form-control"
                        >
                            <option value="TODO">Todo</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="action-button cancel-button"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`action-button save-button ${isSubmitting ? 'disabled' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
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
