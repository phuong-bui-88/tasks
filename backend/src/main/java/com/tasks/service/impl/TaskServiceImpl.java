package com.tasks.service.impl;

import com.tasks.dto.TaskDTO;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.Task;
import com.tasks.repository.TaskRepository;
import com.tasks.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {
    
    private final TaskRepository taskRepository;
    
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = taskDTO.toEntity();
        if (task.getStatus() == null) {
            task.setStatus(Task.TaskStatus.TODO);
        }
        task.setReminderSent(false);
        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }
    
    @Override
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return TaskDTO.fromEntity(task);
    }
    
    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDTO> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDTO> getTasksByAssignee(String email) {
        return taskRepository.findByAssigneeEmail(email).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setDueDate(taskDTO.getDueDate());
        existingTask.setStatus(taskDTO.getStatus());
        existingTask.setAssigneeEmail(taskDTO.getAssigneeEmail());
        
        Task updatedTask = taskRepository.save(existingTask);
        return TaskDTO.fromEntity(updatedTask);
    }
    
    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }
    
    @Override
    public List<TaskDTO> getTasksDueForReminder() {
        LocalDateTime now = LocalDateTime.now();
        return taskRepository.findByDueDateBeforeAndStatusNotAndReminderSentFalse(
                now.plusDays(1), Task.TaskStatus.DONE).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public void markReminderSent(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setReminderSent(true);
        taskRepository.save(task);
    }
}
