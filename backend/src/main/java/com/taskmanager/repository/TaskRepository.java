package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Used when a MEMBER logs in - they only see their own tasks
    List<Task> findByAssigneeIdOrderByIdDesc(Long assigneeId);
    List<Task> findAllByOrderByIdDesc();
}
