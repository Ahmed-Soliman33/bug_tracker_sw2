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
// send with project details your role
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/{projectName}")
    public Project getProjectIdByName(@PathVariable String name) {
        return projectService.getProjectIdByName(name);
    }

    @GetMapping("/{projectId}")
    public Project getProjectById(@PathVariable Long projectId){
        return projectService.getProjectById(projectId);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{projectId}/admin")
    public Long getProjectAdmin(@PathVariable String projectName) {
        Project project = projectService.getProjectIdByName(projectName);
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
        return projectService.updateProject(id,project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id, @RequestBody Role role) {
        projectService.deleteProject(id, role);
    }
}
