package com.cit.thesis.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cit.thesis.dto.AuthResponse;
import com.cit.thesis.dto.CompleteProfileRequest;
import com.cit.thesis.dto.GoogleLoginRequest;
import com.cit.thesis.dto.LoginRequest;
import com.cit.thesis.dto.RegisterRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.Faculty;
import com.cit.thesis.model.Student;
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

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            // 1. Verify Google token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            // 2. Extract user info from Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            // 3. Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = new User() {};
                user.setEmail(email);
                user.setName(name);
                user.setPictureUrl(picture);
                user.setAuthProvider("google");
                user.setEmailVerified(true);
                user.setRole(null);
                user.setIsProfileComplete(false);
                user = userRepository.save(user);
            } else {

                if (!user.getIsProfileComplete()) {
                    String token = jwtUtil.generateToken(user.getEmail());
                    return buildAuthResponse(user, token);
                }

                if (user.getRole() == UserRole.PENDING) {
                    throw new RuntimeException(
                            "Your account is pending IT Department approval. You will be notified via email once approved.");
                }
            }

            // 4. Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            // 5. Return response
            return buildAuthResponse(user, token);

        } catch (Exception e) {
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
            user.setRole(UserRole.STUDENT_REP);
            user.setIsProfileComplete(true);
            user.setAccountStatus("ACTIVE");

        } else if (selectedRole == UserRole.FACULTY_ADVISER) {
            if (request.getDepartment() == null || request.getDepartment().isBlank()) {
                throw new RuntimeException("Department is required for faculty accounts");
            }
            user.setDepartment(request.getDepartment());
            user.setRole(UserRole.FACULTY_ADVISER);
            user.setIsProfileComplete(true);
            user.setAccountStatus("PENDING");

        } else if (selectedRole == UserRole.ADMIN) {
            user.setRole(UserRole.ADMIN);
            user.setIsProfileComplete(true);
            user.setAccountStatus("ACTIVE");
        }

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    public AuthResponse loginWithEmail(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if ("google".equals(user.getAuthProvider())) {
            throw new RuntimeException("This email is registered with Google. Please use Google Sign-In.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsProfileComplete()) {
            String token = jwtUtil.generateToken(user.getEmail());
            return buildAuthResponse(user, token);
        }

        if (user.getRole() == UserRole.PENDING) {
            throw new RuntimeException("Your account is pending approval. Contact IT Department.");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    public AuthResponse registerFaculty(RegisterRequest request) {
        Faculty faculty = new Faculty();
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        faculty.setEmail(request.getEmail());
        faculty.setName(request.getName());
        faculty.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        faculty.setAuthProvider("email");
        faculty.setEmailVerified(false);
        faculty.setRole(UserRole.FACULTY_ADVISER);
        faculty.setDepartment(request.getDepartment());
        faculty.setFacultyId(request.getFacultyId());
        faculty.setIsAvailable(request.getIsAvailable());
        faculty.setIsProfileComplete(false);
        faculty.setAccountStatus("ACTIVE");

        faculty = userRepository.save(faculty);

        String token = jwtUtil.generateToken(faculty.getEmail());
        return buildAuthResponse(faculty, token);
    }
    public AuthResponse registerStudent(RegisterRequest request) {
        Student student = new Student();
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        
        student.setEmail(request.getEmail());
        student.setName(request.getName());
        student.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        student.setAuthProvider("email");
        student.setEmailVerified(false);
        student.setRole(UserRole.STUDENT_REP);
        student.setIsProfileComplete(false);
        student.setAccountStatus("ACTIVE");
        student.setStudentId(request.getStudentId());
        student.setGroupId(request.getGroupId());
        student.setDepartment(request.getDepartment());
        student = userRepository.save(student);

        String token = jwtUtil.generateToken(student.getEmail());
        return buildAuthResponse(student, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getIsProfileComplete(),
                user.getDepartment(),
                user.getAccountStatus());

        return new AuthResponse(token, userDto);
    }
}