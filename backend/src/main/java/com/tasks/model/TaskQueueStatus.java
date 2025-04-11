package com.tasks.model;

public enum TaskQueueStatus {
    PENDING, // Task is waiting to be processed
    PROCESSING, // Task is currently being processed
    COMPLETED, // Task has been successfully processed
    FAILED // Task processing has failed
}
