package com.cit.thesis.service;

import com.cit.thesis.dto.AuthResponse;
import com.cit.thesis.dto.GoogleLoginRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.UserRepository;
import com.cit.thesis.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            // Verify Google ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());

            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name);
                        newUser.setPictureUrl(pictureUrl);
                        newUser.setGoogleId(googleId);
                        newUser.setRole(UserRole.STUDENT_REP); // Default role
                        newUser.setActive(true);
                        return userRepository.save(newUser);
                    });

            // Update user info if changed
            if (!user.getName().equals(name) || !user.getPictureUrl().equals(pictureUrl)) {
                user.setName(name);
                user.setPictureUrl(pictureUrl);
                userRepository.save(user);
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            // Create response
            UserDto userDto = new UserDto(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getPictureUrl(),
                    user.getRole());

            return new AuthResponse(token, userDto);

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage(), e);
        }
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole());
    }
}