package com.example.Bug.Service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PROJECT-SERVICE", url = "http://PROJECT-SERVICE:8083")

public interface ProjectClient {

    @GetMapping("/projects/{id}")
    Long getProjectIdByName(@PathVariable String name);
    // getting the ID to Admin
    @GetMapping("/projects/{id}/admin")
    Long getProjectAdmin(@PathVariable Long id);
}
