package com.tasks.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_queue_items")
@Data
@NoArgsConstructor
public class TaskQueueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long taskId;

    @Enumerated(EnumType.STRING)
    private TaskQueueStatus status;

    private int retryCount;

    @Column(length = 1000)
    private String errorMessage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Lob
    @Column(name = "payload", columnDefinition = "LONGTEXT")
    private String payload;

    @Column(length = 100)
    private String googleResourceId;

    @Column(length = 50)
    private String operationType; // CREATE, UPDATE, DELETE

    // Constructor for new queue items
    public TaskQueueItem(Long taskId, String payload, String operationType) {
        this.taskId = taskId;
        this.status = TaskQueueStatus.PENDING;
        this.retryCount = 0;
        this.payload = payload;
        this.operationType = operationType;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Update status method
    public void updateStatus(TaskQueueStatus newStatus, String errorMessage) {
        this.status = newStatus;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
        if (newStatus == TaskQueueStatus.FAILED) {
            this.retryCount++;
        }
    }
}
