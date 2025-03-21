package com.tasks.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tasks.dto.TaskDTO;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.Task;
import com.tasks.model.User;
import com.tasks.repository.TaskRepository;
import com.tasks.service.TaskService;

@Service
public class TaskServiceImpl implements TaskService {
    
    private final TaskRepository taskRepository;
    
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    @Override
    public TaskDTO createTask(TaskDTO taskDTO, User author) {
        Task task = taskDTO.toEntity();
        if (task.getStatus() == null) {
            task.setStatus(Task.TaskStatus.PENDING);
        }
        task.setAuthor(author);
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
    public List<TaskDTO> getTasksByAuthor(Long authorId) {
        return taskRepository.findByAuthorId(authorId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setStartDate(taskDTO.getStartDate());
        existingTask.setDueDate(taskDTO.getDueDate());
        existingTask.setStatus(taskDTO.getStatus());
        
        Task updatedTask = taskRepository.save(existingTask);
        return TaskDTO.fromEntity(updatedTask);
    }
    
    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }
}
