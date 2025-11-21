package com.cit.thesis.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role;

    @Column(name = "student_id", unique = true)
    private String studentId;

    @Column(name = "team_code", length = 20)
    private String teamCode;

    @Column(length = 100)
    private String department;

    @Column(name = "auth_provider", nullable = false, length = 20)
    private String authProvider = "email";

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "is_profile_complete", nullable = false)
    private Boolean isProfileComplete = false;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "account_status", length = 20)
    private String accountStatus = "ACTIVE";

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (authProvider == null) {
            authProvider = "email";
        }
        if (isProfileComplete == null) {
            isProfileComplete = false;
        }
        if (emailVerified == null) {
            emailVerified = false;
        }
        if (active == null) {
            active = true;
        }
        if (accountStatus == null) {
            accountStatus = "ACTIVE";
        }
    }
}