package com.cit.thesis.service;

import com.cit.thesis.dto.UpdateProfileRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDto(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update allowed fields
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        // Student ID cannot be changed after registration
        // if (request.getStudentId() != null && !request.getStudentId().isBlank()) {
        // user.setStudentId(request.getStudentId());
        // }

        if (request.getTeamCode() != null && !request.getTeamCode().isBlank()) {
            // Validate and uppercase team code
            String teamCode = request.getTeamCode().toUpperCase().trim();
            if (!teamCode.matches("^TEAM-\\d{2}$")) {
                throw new RuntimeException("Team code must follow format TEAM-XX (e.g., TEAM-01)");
            }
            user.setTeamCode(teamCode);
        }

        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            user.setDepartment(request.getDepartment());
        }

        user = userRepository.save(user);
        return convertToDto(user);
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
}