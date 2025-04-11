package com.tasks.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tasks.model.TaskQueueItem;
import com.tasks.model.TaskQueueStatus;

@Repository
public interface TaskQueueRepository extends JpaRepository<TaskQueueItem, Long> {

    // Find tasks by status
    List<TaskQueueItem> findByStatus(TaskQueueStatus status);

    // Use Pageable for pagination instead of int parameter
    List<TaskQueueItem> findByStatusOrderByCreatedAtAsc(TaskQueueStatus status, Pageable pageable);

    // Find failed tasks eligible for retry
    List<TaskQueueItem> findByStatusAndRetryCountLessThan(TaskQueueStatus status, int maxRetries);

    // Find tasks by taskId
    List<TaskQueueItem> findByTaskId(Long taskId);

    // Find tasks by status and taskId
    TaskQueueItem findByTaskIdAndStatus(Long taskId, TaskQueueStatus status);

    // Find tasks older than a certain time
    List<TaskQueueItem> findByStatusAndCreatedAtBefore(TaskQueueStatus status, LocalDateTime time);

    // Count tasks by status
    long countByStatus(TaskQueueStatus status);
}
