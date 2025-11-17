package com.cit.thesis.dto;

public class UpdateProfileRequest {
    private String name;
    private String studentId;
    private String teamCode;
    private String department;
    private String pictureUrl;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String name, String studentId, String teamCode, String department) {
        this.name = name;
        this.studentId = studentId;
        this.teamCode = teamCode;
        this.department = department;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }
}