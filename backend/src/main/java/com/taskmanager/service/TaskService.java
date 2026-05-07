package com.taskmanager.service;

import com.taskmanager.dto.TaskDto;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskDto.Response create(TaskDto.Request req, User creator) {
        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setDueDate(req.getDueDate());

        if (req.getPriority() != null)
            task.setPriority(Task.Priority.valueOf(req.getPriority()));

        // Link to project - throws if not found
        task.setProject(projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found")));

        // Optionally assign to a user
        if (req.getAssigneeId() != null)
            task.setAssignee(userRepository.findById(req.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found")));

        return toResponse(taskRepository.save(task));
    }

    // ADMIN sees all tasks, MEMBER sees only their assigned tasks
    public List<TaskDto.Response> getAll(User requester) {
        List<Task> tasks = requester.getRole() == User.Role.ADMIN
                ? taskRepository.findAllByOrderByIdDesc()
                : taskRepository.findByAssigneeIdOrderByIdDesc(requester.getId());

        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskDto.Response updateStatus(Long id, String status, User requester) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Members can only update tasks assigned to them
        if (requester.getRole() != User.Role.ADMIN &&
                (task.getAssignee() == null || !task.getAssignee().getId().equals(requester.getId())))
            throw new RuntimeException("Not authorized");

        task.setStatus(Task.Status.valueOf(status));
        return toResponse(taskRepository.save(task));
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    // Flatten nested entity into a flat DTO for the frontend
    private TaskDto.Response toResponse(Task t) {
        TaskDto.Response res = new TaskDto.Response();
        res.setId(t.getId());
        res.setTitle(t.getTitle());
        res.setDescription(t.getDescription());
        res.setStatus(t.getStatus().name());
        res.setPriority(t.getPriority().name());
        res.setDueDate(t.getDueDate());
        res.setProjectId(t.getProject().getId());
        res.setProjectName(t.getProject().getName());
        if (t.getAssignee() != null) {
            res.setAssigneeId(t.getAssignee().getId());
            res.setAssigneeName(t.getAssignee().getName());
        }
        return res;
    }
}
