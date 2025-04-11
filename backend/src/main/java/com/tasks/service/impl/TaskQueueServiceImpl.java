package com.tasks.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tasks.dto.TaskDTO;
import com.tasks.model.Task;
import com.tasks.model.TaskQueueItem;
import com.tasks.model.TaskQueueStatus;
import com.tasks.repository.TaskQueueRepository;
import com.tasks.repository.TaskRepository;
import com.tasks.service.GoogleApiService;
import com.tasks.service.TaskQueueService;

@Service
public class TaskQueueServiceImpl implements TaskQueueService {

    private static final Logger logger = LoggerFactory.getLogger(TaskQueueServiceImpl.class);

    private final TaskQueueRepository taskQueueRepository;
    private final TaskRepository taskRepository;
    private final ObjectMapper objectMapper;
    private final GoogleApiService googleApiService;

    @Autowired
    public TaskQueueServiceImpl(TaskQueueRepository taskQueueRepository, TaskRepository taskRepository,
            GoogleApiService googleApiService) {
        this.taskQueueRepository = taskQueueRepository;
        this.taskRepository = taskRepository;
        this.googleApiService = googleApiService;

        // Configure ObjectMapper with Java 8 date/time module
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        this.objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        logger.info("Initialized TaskQueueServiceImpl with configured ObjectMapper");
    }

    @Override
    public TaskQueueItem enqueueTask(Task task, String operationType) {
        try {
            String payload = objectMapper.writeValueAsString(task);
            TaskQueueItem queueItem = new TaskQueueItem(task.getId(), payload, operationType);
            logger.info("Enqueueing task {} for {} operation", task.getId(), operationType);
            return taskQueueRepository.save(queueItem);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing task: {}", e.getMessage());
            throw new RuntimeException("Error enqueueing task", e);
        }
    }

    @Override
    public TaskQueueItem enqueueTaskFromDTO(TaskDTO taskDTO, String operationType) {
        try {
            String payload = objectMapper.writeValueAsString(taskDTO);
            TaskQueueItem queueItem = new TaskQueueItem(taskDTO.getId(), payload, operationType);
            logger.info("Enqueueing task {} for {} operation", taskDTO.getId(), operationType);
            return taskQueueRepository.save(queueItem);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing task DTO: {}", e.getMessage());
            throw new RuntimeException("Error enqueueing task", e);
        }
    }

    @Override
    public List<TaskQueueItem> processNextBatch(int batchSize) {
        Pageable pageable = PageRequest.of(0, batchSize);
        List<TaskQueueItem> pendingItems = taskQueueRepository.findByStatusOrderByCreatedAtAsc(TaskQueueStatus.PENDING,
                pageable);

        for (TaskQueueItem item : pendingItems) {
            processQueueItem(item);
        }

        return pendingItems;
    }

    private void processQueueItem(TaskQueueItem item) {
        logger.info("Processing queue item {} for task {}", item.getId(), item.getTaskId());

        // Mark as processing
        item.updateStatus(TaskQueueStatus.PROCESSING, null);
        taskQueueRepository.save(item);

        try {
            boolean success = false;

            // Determine if this is a calendar operation or if the task should be synced to
            // calendar
            boolean isCalendarOperation = item.getOperationType().toUpperCase().contains("CALENDAR");
            boolean shouldSyncToCalendar = !isCalendarOperation
                    && googleApiService.shouldSyncAsCalendarEvent(item.getPayload());

            // Process operation
            if (isCalendarOperation || shouldSyncToCalendar) {
                switch (item.getOperationType().toUpperCase()) {
                case "CREATE":
                case "CREATE_TASK":
                case "CREATE_CALENDAR":
                    // Create calendar event for this task
                    String eventId = googleApiService.createCalendarEvent(item.getPayload());
                    item.setGoogleResourceId(eventId);
                    logger.info("Created calendar event with ID: {}", eventId);
                    success = true;
                    break;

                case "UPDATE":
                case "UPDATE_TASK":
                case "UPDATE_CALENDAR":
                    // Update existing calendar event
                    googleApiService.updateCalendarEvent(item.getPayload(), item.getGoogleResourceId());
                    logger.info("Updated calendar event with ID: {}", item.getGoogleResourceId());
                    success = true;
                    break;

                case "DELETE":
                case "DELETE_TASK":
                case "DELETE_CALENDAR":
                    // Delete calendar event
                    googleApiService.deleteCalendarEvent(item.getGoogleResourceId());
                    logger.info("Deleted calendar event with ID: {}", item.getGoogleResourceId());
                    success = true;
                    break;

                default:
                    // Skip any other operations
                    logger.info("Skipping non-calendar operation: {}", item.getOperationType());
                    success = true;
                    break;
                }
            } else {
                // Skip non-calendar tasks that shouldn't be synced
                logger.info("Skipping non-calendar eligible task");
                success = true;
            }

            if (success) {
                item.updateStatus(TaskQueueStatus.COMPLETED, null);
                logger.info("Successfully processed queue item {}", item.getId());
            }
        } catch (Exception e) {
            logger.error("Error processing queue item {}: {}", item.getId(), e.getMessage(), e);
            item.updateStatus(TaskQueueStatus.FAILED, e.getMessage());

            // Add retry logic for specific API errors
            if (e.getMessage().contains("401 Unauthorized")) {
                logger.warn("Authentication error detected. Credentials may need to be refreshed.");
            }
        }

        taskQueueRepository.save(item);
    }

    private boolean isGoogleApiAvailable() {
        return googleApiService != null && googleApiService.isAuthenticated();
    }

    @Override
    public List<TaskQueueItem> retryFailedTasks(int maxRetries) {
        List<TaskQueueItem> failedItems = taskQueueRepository.findByStatusAndRetryCountLessThan(TaskQueueStatus.FAILED,
                maxRetries);

        logger.info("Retrying {} failed tasks", failedItems.size());

        for (TaskQueueItem item : failedItems) {
            item.updateStatus(TaskQueueStatus.PENDING, null);
            taskQueueRepository.save(item);
        }

        return failedItems;
    }

    @Override
    public Map<String, Long> getQueueStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("PENDING", taskQueueRepository.countByStatus(TaskQueueStatus.PENDING));
        stats.put("PROCESSING", taskQueueRepository.countByStatus(TaskQueueStatus.PROCESSING));
        stats.put("COMPLETED", taskQueueRepository.countByStatus(TaskQueueStatus.COMPLETED));
        stats.put("FAILED", taskQueueRepository.countByStatus(TaskQueueStatus.FAILED));
        stats.put("TOTAL", (long) taskQueueRepository.findAll().size());
        return stats;
    }

    @Override
    public List<TaskQueueItem> getQueueItems(String status, int limit) {
        if (status != null) {
            TaskQueueStatus queueStatus = TaskQueueStatus.valueOf(status.toUpperCase());
            return taskQueueRepository.findByStatus(queueStatus).stream().limit(limit).collect(Collectors.toList());
        }
        return taskQueueRepository.findAll().stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public TaskQueueItem getQueueItemById(Long id) {
        return taskQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Queue item not found with id: " + id));
    }

    @Override
    public int cleanupOldQueueItems(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);

        List<TaskQueueItem> oldCompletedItems = taskQueueRepository
                .findByStatusAndCreatedAtBefore(TaskQueueStatus.COMPLETED, cutoffDate);

        List<TaskQueueItem> oldFailedItems = taskQueueRepository.findByStatusAndCreatedAtBefore(TaskQueueStatus.FAILED,
                cutoffDate);

        int totalDeleted = oldCompletedItems.size() + oldFailedItems.size();

        taskQueueRepository.deleteAll(oldCompletedItems);
        taskQueueRepository.deleteAll(oldFailedItems);

        logger.info("Deleted {} old queue items", totalDeleted);

        return totalDeleted;
    }
}
