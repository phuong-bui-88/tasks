package com.tasks.service;

import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    TaskDTO getTaskById(Long id);
    List<TaskDTO> getAllTasks();
    List<TaskDTO> getTasksByStatus(Task.TaskStatus status);
    List<TaskDTO> getTasksByAssignee(String email);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
    List<TaskDTO> getTasksDueForReminder();
    void markReminderSent(Long id);
}
