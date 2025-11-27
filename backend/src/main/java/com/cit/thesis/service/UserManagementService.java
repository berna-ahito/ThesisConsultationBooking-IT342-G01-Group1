package com.cit.thesis.service;

import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.ConsultationRepository;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.cit.thesis.dto.PagedResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

        private final UserRepository userRepository;
        private final AuditLogService auditLogService;
        private final ConsultationRepository consultationRepository;

        public UserManagementService(UserRepository userRepository, AuditLogService auditLogService,
                        ConsultationRepository consultationRepository) {
                this.userRepository = userRepository;
                this.auditLogService = auditLogService;
                this.consultationRepository = consultationRepository;
        }

        public List<UserDto> getAllUsers() {
                List<User> users = userRepository.findAll()
                                .stream()
                                .filter(u -> !"DEACTIVATED".equals(u.getAccountStatus()))
                                .collect(Collectors.toList());

                return users.stream().map(this::convertToDto).collect(Collectors.toList());
        }

        public PagedResponse<UserDto> getAllUsers(int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<User> userPage = userRepository.findAll(pageable);

                List<UserDto> dtos = userPage.getContent().stream()
                                .filter(u -> !"DEACTIVATED".equals(u.getAccountStatus()))
                                .map(this::convertToDto)
                                .collect(Collectors.toList());

                return new PagedResponse<>(
                                dtos,
                                userPage.getNumber(),
                                userPage.getTotalPages(),
                                userPage.getTotalElements(),
                                userPage.getSize(),
                                userPage.isFirst(),
                                userPage.isLast());
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

                // Log user approval
                auditLogService.log(
                                null,
                                "system",
                                "USER_APPROVED",
                                "User",
                                user.getId(),
                                "Admin approved " + user.getEmail() + " as " + user.getRole().name(),
                                null);

                return convertToDto(user);
        }

        @Transactional
        public void rejectUser(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!"PENDING".equals(user.getAccountStatus())) {
                        throw new RuntimeException("User is not pending approval");
                }

                // Log user rejection
                auditLogService.log(
                                null,
                                "system",
                                "USER_REJECTED",
                                "User",
                                user.getId(),
                                "Admin rejected " + user.getEmail(),
                                null);

                userRepository.delete(user);

        }

        @Transactional
        public void deleteUser(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Check if user has any consultations (as student or adviser)
                long studentConsultations = consultationRepository.countByStudentId(userId);
                long adviserConsultations = consultationRepository.countByAdviserId(userId);
                long totalConsultations = studentConsultations + adviserConsultations;

                if (totalConsultations == 0) {
                        // Hard delete - remove completely from database
                        auditLogService.log(
                                        null,
                                        "system",
                                        "USER_HARD_DELETED",
                                        "User",
                                        user.getId(),
                                        "Admin permanently deleted " + user.getEmail() + " (no consultations)",
                                        null);

                        userRepository.delete(user);
                } else {
                        // Soft delete - keep for audit trail
                        user.setAccountStatus("DEACTIVATED");
                        user.setActive(false);

                        auditLogService.log(
                                        null,
                                        "system",
                                        "USER_SOFT_DELETED",
                                        "User",
                                        user.getId(),
                                        "Admin deactivated " + user.getEmail() + " (" + totalConsultations
                                                        + " consultations)",
                                        null);

                        userRepository.save(user);
                }
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
                                user.getFacultyId(),
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