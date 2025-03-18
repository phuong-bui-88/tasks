# Phase 8: Remove Priority and Status Fields from Task Creation

## Task Checklist

- [x] Remove priority selection UI from CreateTaskForm
- [x] Remove status selection UI from CreateTaskForm 
- [x] Keep status field in the state with default value 1 (PENDING)
- [x] Remove FlagIcon and StatusIcon components that are no longer needed
- [x] Remove handlePriorityChange function
- [x] Remove handleStatusChange function
- [x] Keep form submission logic intact with default values
- [x] Test task creation to ensure it works with default values
- [x] Verify that new tasks are created with PENDING status
- [x] Remove priority selection UI from TaskEditForm
- [x] Completely remove priority field from task payloads
- [x] Remove priority field from state management
- [x] Remove priority from task creation API requests
- [x] Remove priority from task update API requests
- [x] Update task creation to use "status: 1" instead of "completed: false"
- [x] Remove completed field from task creation payload
