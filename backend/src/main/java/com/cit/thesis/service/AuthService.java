package com.cit.thesis.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.cit.thesis.dto.AuthResponse;
import com.cit.thesis.dto.CompleteProfileRequest;
import com.cit.thesis.dto.GoogleLoginRequest;
import com.cit.thesis.dto.LoginRequest;
import com.cit.thesis.dto.RegisterRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.UserRepository;
import com.cit.thesis.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.auditLogService = auditLogService;
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            // Check if credential is provided
            if (request.getCredential() == null || request.getCredential().isEmpty()) {
                throw new RuntimeException("Google credential is missing");
            }

            // 1. Verify Google token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token. Please try again.");
            }

            // 2. Extract user info from Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            // 3. Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Create new user with required fields
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPictureUrl(picture);
                user.setAuthProvider("google");
                user.setEmailVerified(true);
                user.setRole(null);
                user.setIsProfileComplete(false);
                user = userRepository.save(user);
            } else {
                if (user.getActive() == false || "DEACTIVATED".equals(user.getAccountStatus())) {
                    throw new RuntimeException("Account is deactivated. Contact administrator.");
                }
                // Existing user - check profile completion
                if (!user.getIsProfileComplete()) {
                    String token = user.getRole() != null
                            ? jwtUtil.generateToken(user.getEmail(), user.getRole().name())
                            : jwtUtil.generateToken(user.getEmail());
                    return buildAuthResponse(user, token);
                }

                if ("PENDING".equals(user.getAccountStatus())) {
                    throw new RuntimeException(
                            "Your account is pending IT Department approval. Please check back later.");
                }
            }

            // 4. Generate JWT token
            String token = user.getRole() != null
                    ? jwtUtil.generateToken(user.getEmail(), user.getRole().name())
                    : jwtUtil.generateToken(user.getEmail());

            // 5. Log successful login
            auditLogService.log(
                    user.getId(),
                    user.getEmail(),
                    "USER_LOGIN",
                    "User",
                    user.getId(),
                    "Google OAuth login",
                    getClientIp());

            // 6. Return response
            return buildAuthResponse(user, token);

        } catch (Exception e) {
            System.err.println("Google authentication error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Google authentication failed: " + e.getMessage(), e);
        }
    }

    public AuthResponse completeProfile(CompleteProfileRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsProfileComplete()) {
            throw new RuntimeException("Profile already completed");
        }

        UserRole selectedRole;
        try {
            selectedRole = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        if (selectedRole == UserRole.ADMIN) {
            throw new RuntimeException("Admin accounts must be created by system administrators");
        }

        if (selectedRole == UserRole.STUDENT_REP) {
            if (request.getStudentId() == null || request.getStudentId().isBlank()) {
                throw new RuntimeException("Student ID is required for student accounts");
            }
            if (request.getTeamCode() == null || request.getTeamCode().isBlank()) {
                throw new RuntimeException("Team code is required for student accounts");
            }

            // CONVERT TO UPPERCASE FIRST
            String teamCode = request.getTeamCode().toUpperCase().trim();

            // THEN VALIDATE
            if (!teamCode.matches("^TEAM-\\d{2}$")) {
                throw new RuntimeException("Team code must follow format TEAM-XX (e.g., TEAM-01, TEAM-15)");
            }

            user.setStudentId(request.getStudentId());
            user.setTeamCode(teamCode);
            user.setRole(UserRole.STUDENT_REP);
            user.setIsProfileComplete(true);
            user.setAccountStatus("ACTIVE");

        } else if (selectedRole == UserRole.FACULTY_ADVISER) {
            if (request.getFacultyId() == null || request.getFacultyId().isBlank()) {
                throw new RuntimeException("Faculty ID is required for faculty accounts");
            }
            if (request.getDepartment() == null || request.getDepartment().isBlank()) {
                throw new RuntimeException("Department is required for faculty accounts");
            }
            user.setFacultyId(request.getFacultyId());
            user.setDepartment("IT Department");
            user.setRole(UserRole.FACULTY_ADVISER);
            user.setIsProfileComplete(true);
            user.setAccountStatus("PENDING");

        } else if (selectedRole == UserRole.ADMIN) {
            user.setRole(UserRole.ADMIN);
            user.setIsProfileComplete(true);
            user.setAccountStatus("ACTIVE");
        }

        user = userRepository.save(user);

        /// Log profile completion
        auditLogService.log(
                user.getId(),
                user.getEmail(),
                "PROFILE_COMPLETED",
                "User",
                user.getId(),
                "Completed profile as " + user.getRole().name(),
                getClientIp());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse loginWithEmail(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if ("google".equals(user.getAuthProvider())) {
            throw new RuntimeException("This email is registered with Google. Please use Google Sign-In.");
        }

        if ("DEACTIVATED".equals(user.getAccountStatus())) {
            throw new RuntimeException("ACCOUNT_DEACTIVATED");
        }

        // Password check
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsProfileComplete()) {
            String token = user.getRole() != null
                    ? jwtUtil.generateToken(user.getEmail(), user.getRole().name())
                    : jwtUtil.generateToken(user.getEmail());
            return buildAuthResponse(user, token);
        }

        if ("PENDING".equals(user.getAccountStatus())) {
            throw new RuntimeException(
                    "Your account is pending IT Department approval. Please check back later.");
        }

        // Log successful login
        auditLogService.log(
                user.getId(),
                user.getEmail(),
                "USER_LOGIN",
                "User",
                user.getId(),
                "Email/password login",
                getClientIp());

        String token = user.getRole() != null
                ? jwtUtil.generateToken(user.getEmail(), user.getRole().name())
                : jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("email");
        user.setEmailVerified(false);
        user.setRole(null);
        user.setIsProfileComplete(false);
        user.setAccountStatus("ACTIVE");

        user = userRepository.save(user);

        // Log new registration
        auditLogService.log(
                user.getId(),
                user.getEmail(),
                "USER_REGISTERED",
                "User",
                user.getId(),
                "New user registration via email",
                getClientIp());

        String token = user.getRole() != null
                ? jwtUtil.generateToken(user.getEmail(), user.getRole().name())
                : jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        UserDto userDto = new UserDto(
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

        return new AuthResponse(token, userDto);
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String ip = request.getHeader("X-Forwarded-For");
                if (ip == null || ip.isEmpty()) {
                    ip = request.getRemoteAddr();
                }
                return ip;
            }
        } catch (Exception e) {
            // Ignore
        }
        return "unknown";
    }
}