package com.cit.thesis.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateScheduleRequest {
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;

    public CreateScheduleRequest() {
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
}