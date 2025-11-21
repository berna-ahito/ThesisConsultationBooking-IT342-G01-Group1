package com.cit.thesis.service;

import com.cit.thesis.dto.UpdateProfileRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.ConsultationRepository;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;

    public UserService(UserRepository userRepository, ConsultationRepository consultationRepository) {
        this.userRepository = userRepository;
        this.consultationRepository = consultationRepository;
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

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getTeamCode() != null && !request.getTeamCode().isBlank()) {
            String teamCode = request.getTeamCode().toUpperCase().trim();
            if (!teamCode.matches("^TEAM-\\d{2}$")) {
                throw new RuntimeException("Team code must follow format TEAM-XX (e.g., TEAM-01)");
            }
            user.setTeamCode(teamCode);
        }

        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            user.setDepartment(request.getDepartment());
        }

        if (request.getPictureUrl() != null && !request.getPictureUrl().isBlank()) {
            user.setPictureUrl(request.getPictureUrl());
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

    // Deactivate own account
    @Transactional
    public void deactivateMyAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        user.setAccountStatus("DEACTIVATED");
        userRepository.save(user);
    }

    // Admin: Deactivate user
    @Transactional
    public UserDto deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        user.setAccountStatus("DEACTIVATED");
        user = userRepository.save(user);
        return convertToDto(user);
    }

    // Admin: Reactivate user
    @Transactional
    public UserDto reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);
        user.setAccountStatus("ACTIVE");
        user = userRepository.save(user);
        return convertToDto(user);
    }

    // Admin: Delete user (with consultation check)
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user has consultations
        if (user.getRole() == UserRole.STUDENT_REP) {
            // Check if student has consultations
            long consultationCount = consultationRepository.countByStudentId(userId);
            if (consultationCount > 0) {
                throw new RuntimeException(
                        "Cannot delete user with existing consultations. Please deactivate instead.");
            }
        } else if (user.getRole() == UserRole.FACULTY_ADVISER) {
            // Check if adviser has consultations
            long consultationCount = consultationRepository.countByAdviserId(userId);
            if (consultationCount > 0) {
                throw new RuntimeException(
                        "Cannot delete user with existing consultations. Please deactivate instead.");
            }
        }

        userRepository.delete(user);
    }
}