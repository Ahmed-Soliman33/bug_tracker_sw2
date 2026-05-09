package com.example.Notification.Service.service;

import com.example.Notification.Service.Entity.Notification;
import com.example.Notification.Service.Entity.Status;
import com.example.Notification.Service.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    // this method creates notification from user to another user
    public Notification sendNotification(Long senderId, Long receiverId, Long bugId, String message) {
        // creating notification object from Notification class
        Notification notification = new Notification();

        notification.setSenderId(senderId);
        notification.setReceiverId(receiverId);
        notification.setBugId(bugId);
        notification.setMessage(message);
        notification.setStatus(Status.UNREAD);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("No Notifications"));

        // changing status
        notification.setStatus(Status.READ);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByReceiverId(userId);
    }

}
