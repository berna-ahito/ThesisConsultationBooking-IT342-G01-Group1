package com.cit.thesis.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "team_code", length = 20)
    private String teamCode;

    @Column(name = "adviser_id", nullable = false)
    private Long adviserId;

    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;

    @Column(nullable = false)
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_start", nullable = false)
    private LocalTime startTime;

    @Column(name = "scheduled_end", nullable = false)
    private LocalTime scheduledEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConsultationStatus status = ConsultationStatus.PENDING;

    @Column(name = "adviser_notes", columnDefinition = "TEXT")
    private String adviserNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Getters
    public Long getId() { return id; }
    public Long getStudentId() { return studentId; }
    public String getTeamCode() { return teamCode; }
    public Long getAdviserId() { return adviserId; }
    public Long getScheduleId() { return scheduleId; }
    public String getTopic() { return topic; }
    public String getDescription() { return description; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getScheduledEnd() { return scheduledEnd; }
    public ConsultationStatus getStatus() { return status; }
    public String getAdviserNotes() { return adviserNotes; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setTeamCode(String teamCode) { this.teamCode = teamCode; }
    public void setAdviserId(Long adviserId) { this.adviserId = adviserId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    public void setTopic(String topic) { this.topic = topic; }
    public void setDescription(String description) { this.description = description; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setScheduledEnd(LocalTime scheduledEnd) { this.scheduledEnd = scheduledEnd; }
    public void setStatus(ConsultationStatus status) { this.status = status; }
    public void setAdviserNotes(String adviserNotes) { this.adviserNotes = adviserNotes; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}