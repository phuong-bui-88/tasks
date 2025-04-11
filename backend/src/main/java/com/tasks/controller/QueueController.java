package com.tasks.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tasks.model.TaskQueueItem;
import com.tasks.service.GoogleApiService;
import com.tasks.service.TaskQueueService;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*")
public class QueueController {
    
    private final TaskQueueService taskQueueService;
    private final GoogleApiService googleApiService;
    
    @Autowired
    public QueueController(
            TaskQueueService taskQueueService,
            GoogleApiService googleApiService) {
        this.taskQueueService = taskQueueService;
        this.googleApiService = googleApiService;
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Long>> getQueueStatus() {
        return ResponseEntity.ok(taskQueueService.getQueueStatistics());
    }
    
    @GetMapping("/items")
    public ResponseEntity<List<TaskQueueItem>> getQueueItems(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(taskQueueService.getQueueItems(status, limit));
    }
    
    @GetMapping("/items/{id}")
    public ResponseEntity<TaskQueueItem> getQueueItem(@PathVariable Long id) {
        return ResponseEntity.ok(taskQueueService.getQueueItemById(id));
    }
    
    @PostMapping("/process")
    public ResponseEntity<List<TaskQueueItem>> processBatch(
            @RequestParam(defaultValue = "10") int batchSize) {
        List<TaskQueueItem> processed = taskQueueService.processNextBatch(batchSize);
        return ResponseEntity.ok(processed);
    }
    
    @PostMapping("/retry")
    public ResponseEntity<List<TaskQueueItem>> retryFailed(
            @RequestParam(defaultValue = "3") int maxRetries) {
        List<TaskQueueItem> retried = taskQueueService.retryFailedTasks(maxRetries);
        return ResponseEntity.ok(retried);
    }
    
    @PostMapping("/cleanup")
    public ResponseEntity<Integer> cleanup(
            @RequestParam(defaultValue = "7") int days) {
        int count = taskQueueService.cleanupOldQueueItems(days);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/auth-status")
    public ResponseEntity<String> getAuthStatus() {
        return ResponseEntity.ok(googleApiService.getAuthStatus());
    }
}
