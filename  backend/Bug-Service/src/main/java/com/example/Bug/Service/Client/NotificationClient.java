package com.example.Bug.Service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
// REST API communication
@FeignClient(name = "NOTIFICATION-SERVICE", url = "http://NOTIFICATION-SERVICE:8084")
public interface NotificationClient {
    // BUG-SERVICE send notification to NOTIFICATION-SERVICE
    @PostMapping("/notifications/send")
    void sendNotification(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam Long bugId,
            @RequestParam String message
            );
}
