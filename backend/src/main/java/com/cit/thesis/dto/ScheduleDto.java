package com.cit.thesis.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleDto {
    private Long id;
    private Long adviserId;
    private String adviserName;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isBooked;

    public ScheduleDto() {
    }

    public ScheduleDto(Long id, Long adviserId, String adviserName, LocalDate availableDate,
            LocalTime startTime, LocalTime endTime, Boolean isBooked) {
        this.id = id;
        this.adviserId = adviserId;
        this.adviserName = adviserName;
        this.availableDate = availableDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isBooked = isBooked;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getAvailableDate() {
        return availableDate;
    }

    public void setAvailableDate(LocalDate availableDate) {
        this.availableDate = availableDate;
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

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
}