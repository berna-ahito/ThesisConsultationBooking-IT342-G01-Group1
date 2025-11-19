package com.cit.thesis.model;

import java.time.LocalDate;

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
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

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

    @Column(name = "institution_id", nullable = false)
    private Long institutionId;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
    public void setPasswordHash(String passwordHash){
        this.passwordHash = passwordHash;
    }
    public String getPasswordHash(){
        return passwordHash;
    }

    public Boolean getIsProfileComplete() {
        return isProfileComplete;
    }

    public void setIsProfileComplete(Boolean isProfileComplete) {
        this.isProfileComplete = isProfileComplete;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }
    public LocalDateTime getApprovedAt(){
        return approvedAt;
    }
    public void setApprovedAt(LocalDateTime approvedAt){
        this.approvedAt = approvedAt;
    }
    public void setActive(Boolean active){
        this.active = active;
    }
    public void setAuthProvider(String authProvider){
        this.authProvider = authProvider;
    }
    public String getAuthProvider(){
        return authProvider;
    }
    public void setEmailVerified(Boolean emailVerified){
        this.emailVerified = emailVerified;
    }
}