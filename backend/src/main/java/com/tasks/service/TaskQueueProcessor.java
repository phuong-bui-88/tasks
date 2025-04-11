package com.tasks.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import com.tasks.model.TaskQueueItem;

@Component
@EnableScheduling
public class TaskQueueProcessor {

    private static final Logger logger = LoggerFactory.getLogger(TaskQueueProcessor.class);
    
    private final TaskQueueService taskQueueService;
    
    @Value("${task.queue.batch-size:10}")
    private int batchSize;
    
    @Value("${task.queue.max-retries:3}")
    private int maxRetries;
    
    @Value("${task.queue.cleanup-days:7}")
    private int cleanupDays;
    
    @Autowired
    public TaskQueueProcessor(TaskQueueService taskQueueService) {
        this.taskQueueService = taskQueueService;
    }
    
    @Scheduled(fixedDelayString = "${task.queue.process-interval:60000}")
    public void processQueue() {
        try {
            logger.info("Starting scheduled queue processing");
            List<TaskQueueItem> processedItems = taskQueueService.processNextBatch(batchSize);
            logger.info("Processed {} queue items", processedItems.size());
        } catch (Exception e) {
            logger.error("Error processing queue: {}", e.getMessage(), e);
        }
    }
    
    @Scheduled(fixedDelayString = "${task.queue.retry-interval:300000}")
    public void retryFailedTasks() {
        try {
            logger.info("Starting retry of failed tasks");
            List<TaskQueueItem> retriedItems = taskQueueService.retryFailedTasks(maxRetries);
            logger.info("Queued {} items for retry", retriedItems.size());
        } catch (Exception e) {
            logger.error("Error retrying failed tasks: {}", e.getMessage(), e);
        }
    }
    
    @Scheduled(cron = "${task.queue.cleanup-cron:0 0 1 * * ?}") // Default: every day at 1:00 AM
    public void cleanupOldQueueItems() {
        try {
            logger.info("Starting cleanup of old queue items");
            int deletedCount = taskQueueService.cleanupOldQueueItems(cleanupDays);
            logger.info("Cleaned up {} old queue items", deletedCount);
        } catch (Exception e) {
            logger.error("Error cleaning up old queue items: {}", e.getMessage(), e);
        }
    }
    
    @Scheduled(fixedRate = 3600000) // Every hour
    public void logQueueStatistics() {
        try {
            Map<String, Long> stats = taskQueueService.getQueueStatistics();
            logger.info("Queue statistics - Pending: {}, Processing: {}, Completed: {}, Failed: {}, Total: {}",
                    stats.get("PENDING"), stats.get("PROCESSING"), 
                    stats.get("COMPLETED"), stats.get("FAILED"), stats.get("TOTAL"));
        } catch (Exception e) {
            logger.error("Error logging queue statistics: {}", e.getMessage(), e);
        }
    }
}
