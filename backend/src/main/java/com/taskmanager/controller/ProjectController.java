package com.taskmanager.controller;

import com.taskmanager.dto.ProjectDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // GET /api/projects - all roles can view projects
    @GetMapping
    public ResponseEntity<List<ProjectDto.Response>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    // POST /api/projects - only ADMIN can create
    // @PreAuthorize checks the role before the method even runs
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDto.Response> create(
            @Valid @RequestBody ProjectDto.Request req,
            @AuthenticationPrincipal User currentUser) { // Spring injects the logged-in user
        return ResponseEntity.ok(projectService.create(req, currentUser));
    }

    // DELETE /api/projects/{id} - only ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        projectService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
