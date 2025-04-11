package com.tasks.service;

import java.util.List;
import java.util.Map;

import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;
import com.tasks.model.TaskQueueItem;

public interface TaskQueueService {
    
    // Enqueue tasks for Google API operations
    TaskQueueItem enqueueTask(Task task, String operationType);
    TaskQueueItem enqueueTaskFromDTO(TaskDTO taskDTO, String operationType);
    
    // Process tasks
    List<TaskQueueItem> processNextBatch(int batchSize);
    List<TaskQueueItem> retryFailedTasks(int maxRetries);
    
    // Get queue statistics
    Map<String, Long> getQueueStatistics();
    
    // Get queue items
    List<TaskQueueItem> getQueueItems(String status, int limit);
    
    // Get item by ID
    TaskQueueItem getQueueItemById(Long id);
    
    // Delete completed/failed items older than X days
    int cleanupOldQueueItems(int days);
}
