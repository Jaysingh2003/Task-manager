package com.taskmanager.service;

import com.taskmanager.dto.ProjectDto;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
   
    public ProjectDto.Response create(ProjectDto.Request req, User owner) {
        Project project = new Project();
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setOwner(owner); // the logged-in admin becomes the owner
        return toResponse(projectRepository.save(project));
    }

    public List<ProjectDto.Response> getAll() {
        return projectRepository.findAllByOrderByIdDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void delete(Long id, User requester) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Only the owner or any admin can delete
        if (!project.getOwner().getId().equals(requester.getId()))
            throw new RuntimeException("Not authorized");

        projectRepository.delete(project);
    }

    // Convert entity → response DTO (never expose raw entity to frontend)
    private ProjectDto.Response toResponse(Project p) {
        ProjectDto.Response res = new ProjectDto.Response();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setOwnerName(p.getOwner().getName());
        res.setTaskCount(p.getTasks() != null ? p.getTasks().size() : 0);
        // memberCount = unique assignees on this project's tasks
        res.setMemberCount(p.getTasks() != null
                ? (int) p.getTasks().stream()
                    .filter(t -> t.getAssignee() != null)
                    .map(t -> t.getAssignee().getId())
                    .distinct().count()
                : 0);
        return res;
    }
}
