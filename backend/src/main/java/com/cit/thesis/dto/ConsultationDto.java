package com.cit.thesis.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ConsultationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentPictureUrl;
    private String teamCode;
    private Long adviserId;
    private String adviserName;
    private String adviserPictureUrl;
    private String topic;
    private String description;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String adviserNotes;
    private String rejectionReason;

    public ConsultationDto() {
    }

    public ConsultationDto(Long id, Long studentId, String studentName, String teamCode,
            Long adviserId, String adviserName, String topic, String description,
            LocalDate scheduledDate, LocalTime startTime, LocalTime endTime,
            String status, String adviserNotes, String rejectionReason) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.teamCode = teamCode;
        this.adviserId = adviserId;
        this.adviserName = adviserName;
        this.topic = topic;
        this.description = description;
        this.scheduledDate = scheduledDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.adviserNotes = adviserNotes;
        this.rejectionReason = rejectionReason;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public Long getAdviserId() {
        return adviserId;
    }

    public void setAdviserId(Long adviserId) {
        this.adviserId = adviserId;
    }

    public String getAdviserName() {
        return adviserName;
    }

    public void setAdviserName(String adviserName) {
        this.adviserName = adviserName;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdviserNotes() {
        return adviserNotes;
    }

    public void setAdviserNotes(String adviserNotes) {
        this.adviserNotes = adviserNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getStudentPictureUrl() {
        return studentPictureUrl;
    }

    public void setStudentPictureUrl(String studentPictureUrl) {
        this.studentPictureUrl = studentPictureUrl;
    }

    public String getAdviserPictureUrl() {
        return adviserPictureUrl;
    }

    public void setAdviserPictureUrl(String adviserPictureUrl) {
        this.adviserPictureUrl = adviserPictureUrl;
    }
}