package com.cit.thesis.controller;

import com.cit.thesis.dto.UpdateProfileRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.security.JwtUtil;
import com.cit.thesis.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);

            UserDto profile = userService.getUserProfile(email);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);

            UserDto updatedProfile = userService.updateProfile(email, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Student/Faculty: Deactivate own account
    @PutMapping("/deactivate")
    public ResponseEntity<?> deactivateMyAccount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);

            userService.deactivateMyAccount(email);
            return ResponseEntity.ok("Account deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Deactivate user
    @PutMapping("/admin/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UserDto user = userService.deactivateUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Reactivate user
    @PutMapping("/admin/{userId}/reactivate")
    public ResponseEntity<?> reactivateUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UserDto user = userService.reactivateUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Delete user
    @DeleteMapping("/admin/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}