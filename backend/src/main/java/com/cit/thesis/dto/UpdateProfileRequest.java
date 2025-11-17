package com.cit.thesis.dto;

public class UpdateProfileRequest {
    private String name;
    private String studentId;
    private String department;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, String studentId, String department) {
        this.name = name;
        this.studentId = studentId;
        this.department = department;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
