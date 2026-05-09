package com.example.Project.Service.Controller;

import com.example.Project.Service.Entity.Project;
import com.example.Project.Service.Entity.Role;
import com.example.Project.Service.Exception.ErrorRespnse;
import com.example.Project.Service.Service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    // GET /projects/name/{projectName}
    @GetMapping("/name/{projectName}")
    public Project getProjectByName(@PathVariable String projectName) {
        return projectService.getProjectIdByName(projectName);
    }

    // GET /projects/{projectId}
    @GetMapping("/{projectId}")
    public Project getProjectById(@PathVariable Long projectId) {
        return projectService.getProjectById(projectId);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // GET /projects/{projectId}/admin
    @GetMapping("/{projectId}/admin")
    public Long getProjectAdmin(@PathVariable Long projectId) {
        Project project = projectService.getProjectById(projectId);
        return project.getAdminId();
    }

    @PostMapping("/insert")
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody @Valid Project project, @RequestHeader("role") Role role) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Project Created Successfully", projectService.createProject(project, role))
        );
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id, @RequestBody Role role) {
        projectService.deleteProject(id, role);
    }
}
