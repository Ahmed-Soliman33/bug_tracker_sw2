package com.example.Bug.Service.Exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class BugNotFoundException extends RuntimeException {
    private String message;

}
