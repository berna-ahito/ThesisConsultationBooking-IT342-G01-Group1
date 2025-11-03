package com.cit.thesis.dto;

public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String pictureUrl;
    private String role;
    private Boolean isProfileComplete;
    private String studentId;
    private String department;
    private String accountStatus;

    public UserDto(Long id, String email, String name, String pictureUrl, String role,
            Boolean isProfileComplete, String studentId, String department, String accountStatus) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.pictureUrl = pictureUrl;
        this.role = role;
        this.isProfileComplete = isProfileComplete;
        this.studentId = studentId;
        this.department = department;
        this.accountStatus = accountStatus;
    }

    public UserDto(Long id, String email, String name, String pictureUrl, String role,
            Boolean isProfileComplete, String studentId, String department) {
        this(id, email, name, pictureUrl, role, isProfileComplete, studentId, department, "ACTIVE");
    }

    public UserDto(Long id, String email, String name, String pictureUrl, String role) {
        this(id, email, name, pictureUrl, role, true, null, null, "ACTIVE");
    }

    public UserDto() {
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsProfileComplete() {
        return isProfileComplete;
    }

    public void setIsProfileComplete(Boolean isProfileComplete) {
        this.isProfileComplete = isProfileComplete;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
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
}