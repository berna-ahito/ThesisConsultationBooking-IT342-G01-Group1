package com.cit.thesis.dto;

import jakarta.validation.constraints.NotBlank;

public class CompleteProfileRequest {

    @NotBlank(message = "Role is required")
    private String role;

    private String studentId;

    private String teamCode;

    private String department;

    public CompleteProfileRequest() {
    }

    public CompleteProfileRequest(String role, String studentId, String department) {
        this.role = role;
        this.studentId = studentId;
        this.teamCode = teamCode;
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}