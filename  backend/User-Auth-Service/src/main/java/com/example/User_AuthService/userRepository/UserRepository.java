package com.example.User_AuthService.userRepository;

import com.example.User_AuthService.userEntity.Admin;
import com.example.User_AuthService.userEntity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

}
