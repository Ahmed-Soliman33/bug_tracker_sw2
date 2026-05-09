package com.example.Bug.Service.Client;

import com.example.Bug.Service.DTO.ProjectDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PROJECT-SERVICE")
public interface ProjectClient {

    @GetMapping("/projects/name/{projectName}")
    ProjectDTO getProjectByName(@PathVariable String projectName);

    @GetMapping("/projects/{projectId}/admin")
    Long getProjectAdmin(@PathVariable Long projectId);
}
