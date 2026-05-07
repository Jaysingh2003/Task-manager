package com.taskmanager.controller;

import com.taskmanager.dto.TaskDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // GET /api/tasks
    // Service handles role scoping: admin gets all, member gets only theirs
    @GetMapping
    public ResponseEntity<List<TaskDto.Response>> getAll(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(taskService.getAll(currentUser));
    }

    // POST /api/tasks - only ADMIN can create and assign tasks
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskDto.Response> create(
            @Valid @RequestBody TaskDto.Request req,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(taskService.create(req, currentUser));
    }

    // PATCH /api/tasks/{id}/status - admin or assigned member can update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody TaskDto.StatusUpdate req,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(taskService.updateStatus(id, req.getStatus(), currentUser));
    }

    // DELETE /api/tasks/{id} - only ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
