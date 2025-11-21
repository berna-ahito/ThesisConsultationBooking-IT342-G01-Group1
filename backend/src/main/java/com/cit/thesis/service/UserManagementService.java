package com.cit.thesis.service;

import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    private final UserRepository userRepository;

    public UserManagementService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> !"DEACTIVATED".equals(u.getAccountStatus()))
                .collect(Collectors.toList());

        return users.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<UserDto> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByAccountStatus("PENDING");
        return pendingUsers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"PENDING".equals(user.getAccountStatus())) {
            throw new RuntimeException("User is not pending approval");
        }

        user.setAccountStatus("ACTIVE");
        user.setApprovedAt(LocalDateTime.now());
        user.setActive(true);

        user = userRepository.save(user);

        return convertToDto(user);
    }

    @Transactional
    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"PENDING".equals(user.getAccountStatus())) {
            throw new RuntimeException("User is not pending approval");
        }

        userRepository.delete(user);

    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus("DEACTIVATED");
        user.setActive(false);

        userRepository.save(user);
    }

    public Map<String, Long> getUserStats() {
        List<User> allUsers = userRepository.findAll();

        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream()
                .filter(u -> "ACTIVE".equals(u.getAccountStatus()))
                .count();
        long pendingUsers = allUsers.stream()
                .filter(u -> "PENDING".equals(u.getAccountStatus()))
                .count();
        long students = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.STUDENT_REP)
                .count();
        long faculty = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.FACULTY_ADVISER)
                .count();
        long admins = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.ADMIN)
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("pendingUsers", pendingUsers);
        stats.put("students", students);
        stats.put("faculty", faculty);
        stats.put("admins", admins);

        return stats;
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getIsProfileComplete(),
                user.getStudentId(),
                user.getTeamCode(),
                user.getDepartment(),
                user.getAccountStatus());
    }

    public List<UserDto> getArchivedUsers() {
        return userRepository.findByAccountStatus("DEACTIVATED")
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

}