package com.cit.thesis.service;

import com.cit.thesis.dto.UpdateProfileRequest;
import com.cit.thesis.dto.UserDto;
import com.cit.thesis.model.User;
import com.cit.thesis.model.UserRole;
import com.cit.thesis.repository.ConsultationRepository;
import com.cit.thesis.repository.UserRepository;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon.key}")
    private String supabaseAnonKey;

    @Value("${supabase.storage.bucket}")
    private String storageBucket;

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

    @Transactional
    public UserDto uploadProfileImage(MultipartFile file, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (file.isEmpty())
                throw new RuntimeException("File is empty");
            if (file.getSize() > 5 * 1024 * 1024)
                throw new RuntimeException("File exceeds 5MB");

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only images allowed");
            }

            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String fileName = user.getId() + "-" + System.currentTimeMillis() + ext;

            OkHttpClient client = new OkHttpClient();

            RequestBody requestBody = RequestBody.create(file.getBytes(), MediaType.parse(contentType));

            Request request = new Request.Builder()
                    .url(supabaseUrl + "/storage/v1/object/" + storageBucket + "/" + fileName)
                    .post(requestBody)
                    .addHeader("Authorization", "Bearer " + supabaseAnonKey)
                    .addHeader("Content-Type", contentType)
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new RuntimeException("Upload failed: " + response.body().string());
            }

            String pictureUrl = supabaseUrl + "/storage/v1/object/public/" + storageBucket + "/" + fileName;

            user.setPictureUrl(pictureUrl);
            user = userRepository.save(user);

            return convertToDto(user);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload: " + e.getMessage());
        }
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

    @Transactional
    public void deactivateMyAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        user.setAccountStatus("DEACTIVATED");
        userRepository.save(user);
    }

    @Transactional
    public UserDto deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        user.setAccountStatus("DEACTIVATED");
        user = userRepository.save(user);
        return convertToDto(user);
    }

    @Transactional
    public UserDto reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);
        user.setAccountStatus("ACTIVE");
        user = userRepository.save(user);
        return convertToDto(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == UserRole.STUDENT_REP) {
            long consultationCount = consultationRepository.countByStudentId(userId);
            if (consultationCount > 0) {
                throw new RuntimeException(
                        "Cannot delete user with existing consultations. Please deactivate instead.");
            }
        } else if (user.getRole() == UserRole.FACULTY_ADVISER) {
            long consultationCount = consultationRepository.countByAdviserId(userId);
            if (consultationCount > 0) {
                throw new RuntimeException(
                        "Cannot delete user with existing consultations. Please deactivate instead.");
            }
        }

        userRepository.delete(user);
    }
}