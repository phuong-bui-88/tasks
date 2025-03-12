package com.tasks.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;
import com.tasks.model.User;
import com.tasks.repository.UserRepository;
import com.tasks.service.TaskService;
import com.tasks.util.SecurityUtils;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    private final TaskService taskService;
    private final UserRepository userRepository;
    
    @Autowired
    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }
    
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        User currentUser = SecurityUtils.getCurrentUser(userRepository)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated"));
        return new ResponseEntity<>(taskService.createTask(taskDTO, currentUser), HttpStatus.CREATED);
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
    
    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskDTO>> getMyTasks() {
        User currentUser = SecurityUtils.getCurrentUser(userRepository)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated"));
        return ResponseEntity.ok(taskService.getTasksByAuthor(currentUser.getId()));
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
