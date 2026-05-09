package com.example.Bug.Service.Service;

import com.example.Bug.Service.Client.NotificationClient;
import com.example.Bug.Service.Client.ProjectClient;
import com.example.Bug.Service.DTO.ProjectDTO;
import com.example.Bug.Service.Entity.BugPriority;
import com.example.Bug.Service.Entity.BugStatus;
import com.example.Bug.Service.Entity.Role;
import com.example.Bug.Service.Exception.BugNotFoundException;
import com.example.Bug.Service.Exception.ProjectNotFoundException;
import com.example.Bug.Service.Repository.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.Bug.Service.Entity.Bug;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class BugServiceImpl implements BugService{
    // dependency injection
    @Autowired
    private BugRepository bugRepository;
    // to receive the notifications
    @Autowired
    private NotificationClient notificationClient;
    // to connect to the project service
    @Autowired
    private ProjectClient projectClient;

    @Override
    public Bug createBug(String title, String description, BugPriority priority, String projectName, Long customerId){

        ProjectDTO project = projectClient.getProjectByName(projectName);

        if (project == null) {
            throw new ProjectNotFoundException("Project not found");
        }

        Bug bug = new Bug();
        bug.setTitle(title);
        bug.setDescription(description);
        bug.setPriority(priority);
        bug.setProjectName(project.getProjectName());
        bug.setCustomerId(customerId);
        bug.setStatus(BugStatus.OPEN);
        bug.setAssignedStaffId(null);

        Bug savedBug = bugRepository.save(bug);

        Long adminId = projectClient.getProjectAdmin(project.getProjectId());
        notificationClient.sendNotification(
                customerId,
                adminId,
                savedBug.getId(),
                "New bug created"
        );

        return savedBug;
    }
    @Override
    // admin assign bug to staff
    public Bug assignBug(
            Long bugId,
            Long adminId,
            Long staffId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BugNotFoundException("Bug not found"));

        if (bug.getStatus() != BugStatus.OPEN) {
            throw new RuntimeException("Bug is already assigned or closed");
        }

        bug.setAssignedStaffId(staffId);
        bug.setStatus(BugStatus.ASSIGNED);

        Bug updatedBug = bugRepository.save(bug);

        notificationClient.sendNotification(adminId,
                staffId,
                bugId,
                "This bug has been assigned to you");

        return updatedBug;
    }
    @Override
    //staff solve bug and send notification
    public Bug solveBug(Long bugId,
                        Long staffId,
                        Long customerId){

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BugNotFoundException("Bug not found"));
        // if staff solve bug not assigned to it
        if(!staffId.equals(bug.getAssignedStaffId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        bug.setStatus(BugStatus.SOLVED);

        Bug updatedBug = bugRepository.save(bug);

        notificationClient.sendNotification(
                staffId,
                customerId,
                bugId,
                "Bug has been solved"
        );
        // we will create bug topic in kafka named <<solve-bug-topic>>

        return updatedBug;
    }
    @Override
    public void writeCommentOnBug(Long bugId,
                                  Long staffId,
                                  Long adminId,
                                  String comment) {
        notificationClient.sendNotification(
                staffId,
                adminId,
                bugId,
                comment
        );
        // we will create bug topic in kafka named <<solve-bug-topic>>
        //
    }
    @Override
    // admin send message to the customer
    public void adminMessage(Long bugId,
                             Long adminId,
                             Long customerId,
                             String message){

        notificationClient.sendNotification(
                adminId,
                customerId,
                bugId,
                message
        );
        // we will create bug topic in kafka named <<message-topic>>

    }

    @Override
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    @Override
    public Bug getBugById(Long bugId, Long userId, Role role) {
        // in this function we will create logic access roles
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow( () -> new BugNotFoundException("Bug not Found"));
        if (role == Role.ADMIN) {
            return bug;
        }
        if (role == Role.STAFF && bug.getAssignedStaffId().equals(userId)) {
            return bug;
        }
        if (role == Role.CUSTOMER && bug.getCustomerId().equals(userId)) {
            return bug;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @Override
    public Bug updateBug(Long id,Long userId, Role role, Bug bugDetails) {
        Bug bug = getBugById(id, userId, role);
        bug.setTitle(bugDetails.getTitle());
        bug.setDescription(bugDetails.getDescription());
        bug.setPriority(bugDetails.getPriority());
        bug.setStatus(bugDetails.getStatus());

        return bugRepository.save(bug);
    }

    @Override
    public void deleteBug(Long bugId,Long userId,Role role) {
        Bug bug = getBugById(bugId, userId, role);
        if (!Objects.equals(bug.getId(), bugId)){
            throw new BugNotFoundException("Bug Not Found");
        }
        bugRepository.delete(bug);
    }

}
