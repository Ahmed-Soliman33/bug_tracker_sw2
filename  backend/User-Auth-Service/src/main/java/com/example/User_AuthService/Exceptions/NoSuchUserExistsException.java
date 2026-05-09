package com.example.User_AuthService.Exceptions;

public class NoSuchUserExistsException extends RuntimeException{
    private String message;

    public NoSuchUserExistsException() {}

    public NoSuchUserExistsException(String message) {
        super(message);
        this.message = message;
    }
}
