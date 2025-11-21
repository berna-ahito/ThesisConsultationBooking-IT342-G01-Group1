package com.cit.thesis.controller;

import com.cit.thesis.dto.UserDto;
import com.cit.thesis.service.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        try {
            List<UserDto> users = userManagementService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<UserDto>> getPendingUsers() {
        try {
            List<UserDto> pendingUsers = userManagementService.getPendingUsers();
            return ResponseEntity.ok(pendingUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
        try {
            UserDto approvedUser = userManagementService.approveUser(userId);
            return ResponseEntity.ok(Map.of(
                    "message", "User approved successfully",
                    "user", approvedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable Long userId) {
        try {
            userManagementService.rejectUser(userId);
            return ResponseEntity.ok(Map.of(
                    "message", "User rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            Map<String, Long> stats = userManagementService.getUserStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userManagementService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/archived")
    public List<UserDto> getArchivedUsers() {
        return userManagementService.getArchivedUsers();
    }

}