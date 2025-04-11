package com.tasks.service;

import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;
import com.tasks.model.User;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO, User author);
    TaskDTO getTaskById(Long id);
    List<TaskDTO> getAllTasks();
    List<TaskDTO> getTasksByStatus(Task.TaskStatus status);
    List<TaskDTO> getTasksByAuthor(Long authorId);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
    List<TaskDTO> getTasksByStartDateMonthAndYear(int month, int year);
    
    // New methods for Google API integration
    boolean synchronizeTaskWithGoogle(Long taskId);
    void handleGoogleTaskUpdate(String googleTaskId, String payload);
}
