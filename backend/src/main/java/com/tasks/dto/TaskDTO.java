package com.tasks.dto;

import com.tasks.model.Task;
import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    private Task.TaskStatus status;
    private String assigneeEmail;
    private Long authorId;
    private String authorUsername;
    
    public TaskDTO() {
    }
    
    public TaskDTO(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.startDate = task.getStartDate();
        this.dueDate = task.getDueDate();
        this.status = task.getStatus();
        this.assigneeEmail = task.getAssigneeEmail();
        if (task.getAuthor() != null) {
            this.authorId = task.getAuthor().getId();
            this.authorUsername = task.getAuthor().getUsername();
        }
    }
    
    // Static factory method to create DTO from entity
    public static TaskDTO fromEntity(Task task) {
        return new TaskDTO(task);
    }
    
    public Task toEntity() {
        Task task = new Task();
        task.setId(this.id);
        task.setTitle(this.title);
        task.setDescription(this.description);
        task.setStartDate(this.startDate);
        task.setDueDate(this.dueDate);
        task.setStatus(this.status);
        task.setAssigneeEmail(this.assigneeEmail);
        // Author is set by the service layer
        return task;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public Task.TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(Task.TaskStatus status) {
        this.status = status;
    }
    
    public String getAssigneeEmail() {
        return assigneeEmail;
    }
    
    public void setAssigneeEmail(String assigneeEmail) {
        this.assigneeEmail = assigneeEmail;
    }
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    public String getAuthorUsername() {
        return authorUsername;
    }
    
    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }
}
