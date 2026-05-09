package com.example.User_AuthService.Exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvalidDataException extends RuntimeException{
    private String message;
}
