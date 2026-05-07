package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ProjectDto {

    // What the frontend sends when creating a project
    @Data
    public static class Request {
        @NotBlank
        private String name;
        private String description;
    }

    // What we send back - includes computed counts
    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String ownerName;
        private int taskCount;
        private int memberCount;
    }
}
