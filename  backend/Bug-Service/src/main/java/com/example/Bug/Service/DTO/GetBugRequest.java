package com.example.Bug.Service.DTO;

import com.example.Bug.Service.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

// May delete this class and use request
public class GetBugRequest {

    private Long userId;
    private Role role;
}
