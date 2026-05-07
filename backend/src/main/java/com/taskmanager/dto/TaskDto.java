package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

public class TaskDto {

    // What frontend sends when creating a task
    @Data
    public static class Request {
        @NotBlank
        private String title;

        private String description;

        @NotNull
        private Long projectId;

        private Long assigneeId; // nullable = unassigned

        private String priority; // LOW, MEDIUM, HIGH

        private LocalDate dueDate;
    }

    // What we send back - flattened so frontend doesn't need nested objects
    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String status;       // TODO, IN_PROGRESS, DONE
        private String priority;
        private LocalDate dueDate;
        private Long projectId;
        private String projectName;  // flattened from project
        private Long assigneeId;
        private String assigneeName; // flattened from assignee
    }

    // Used for PATCH /tasks/{id}/status
    @Data
    public static class StatusUpdate {
        @NotBlank
        private String status;
    }
}
