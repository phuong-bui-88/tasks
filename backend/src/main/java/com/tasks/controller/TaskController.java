package com.tasks.controller;

import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;
import com.tasks.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    private final TaskService taskService;
    
    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        return new ResponseEntity<>(taskService.createTask(taskDTO), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@PathVariable Task.TaskStatus status) {
        
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }
    
    @GetMapping("/assignee/{email}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssignee(@PathVariable String email) {
        return ResponseEntity.ok(taskService.getTasksByAssignee(email));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/reminders")
    public ResponseEntity<List<TaskDTO>> getTasksDueForReminder() {
        return ResponseEntity.ok(taskService.getTasksDueForReminder());
    }
    
    @PutMapping("/{id}/reminder-sent")
    public ResponseEntity<Void> markReminderSent(@PathVariable Long id) {
        taskService.markReminderSent(id);
        return ResponseEntity.ok().build();
    }
}
