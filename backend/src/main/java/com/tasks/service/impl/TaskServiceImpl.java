package com.tasks.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tasks.dto.TaskDTO;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.Task;
import com.tasks.model.User;
import com.tasks.repository.TaskRepository;
import com.tasks.service.TaskQueueService;
import com.tasks.service.TaskService;

@Service
public class TaskServiceImpl implements TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);
    
    private final TaskRepository taskRepository;
    private final TaskQueueService taskQueueService;
    
    @Autowired
    public TaskServiceImpl(
            TaskRepository taskRepository,
            TaskQueueService taskQueueService) {
        this.taskRepository = taskRepository;
        this.taskQueueService = taskQueueService;
    }
    
    @Override
    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO, User author) {
        Task task = taskDTO.toEntity();
        if (task.getStatus() == null) {
            task.setStatus(Task.TaskStatus.PENDING);
        }
        task.setAuthor(author);
        Task savedTask = taskRepository.save(task);
        
        // Enqueue for Google API
        try {
            taskQueueService.enqueueTask(savedTask, "CREATE");
            logger.info("Task {} enqueued for Google API creation", savedTask.getId());
        } catch (Exception e) {
            logger.error("Failed to enqueue task for Google API: {}", e.getMessage(), e);
            // Don't fail the transaction if Google API integration fails
        }
        
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
    public List<TaskDTO> getTasksByAuthor(Long authorId) {
        return taskRepository.findByAuthorId(authorId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setStartDate(taskDTO.getStartDate());
        existingTask.setDueDate(taskDTO.getDueDate());
        existingTask.setStatus(taskDTO.getStatus());
        
        Task updatedTask = taskRepository.save(existingTask);
        
        // Enqueue for Google API
        try {
            taskQueueService.enqueueTask(updatedTask, "UPDATE");
            logger.info("Task {} enqueued for Google API update", updatedTask.getId());
        } catch (Exception e) {
            logger.error("Failed to enqueue task update for Google API: {}", e.getMessage(), e);
        }
        
        return TaskDTO.fromEntity(updatedTask);
    }
    
    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        // Enqueue delete operation before actually deleting
        try {
            taskQueueService.enqueueTask(task, "DELETE");
            logger.info("Task {} enqueued for Google API deletion", task.getId());
        } catch (Exception e) {
            logger.error("Failed to enqueue task deletion for Google API: {}", e.getMessage(), e);
        }
        
        taskRepository.delete(task);
    }
    
    @Override
    public List<TaskDTO> getTasksByStartDateMonthAndYear(int month, int year) {
        return taskRepository.findAll().stream()
                .filter(task -> {
                    if (task.getStartDate() == null) return false;
                    return task.getStartDate().getMonthValue() == month && 
                           task.getStartDate().getYear() == year;
                })
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public boolean synchronizeTaskWithGoogle(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
                
        try {
            taskQueueService.enqueueTask(task, "UPDATE");
            logger.info("Task {} enqueued for Google API synchronization", task.getId());
            return true;
        } catch (Exception e) {
            logger.error("Failed to synchronize task with Google API: {}", e.getMessage(), e);
            return false;
        }
    }
    
    @Override
    @Transactional
    public void handleGoogleTaskUpdate(String googleTaskId, String payload) {
        // Implementation for handling updates from Google API
        // This would be used in a webhook or pull mechanism from Google
        logger.info("Received update from Google for task ID: {}", googleTaskId);
        // Process the update...
    }
}
