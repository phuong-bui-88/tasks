package com.tasks.repository;

import com.tasks.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(Task.TaskStatus status);
    List<Task> findByAssigneeEmail(String email);
    List<Task> findByDueDateBeforeAndStatusNotAndReminderSentFalse(LocalDateTime dueDate, Task.TaskStatus status);
    List<Task> findByAuthorId(Long authorId);
}
