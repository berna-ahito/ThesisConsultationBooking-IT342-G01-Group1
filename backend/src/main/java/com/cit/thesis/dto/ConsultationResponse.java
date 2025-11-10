package com.cit.thesis.dto;

import com.cit.thesis.model.ConsultationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponse {
    private Long id;
    private UserDto student;
    private UserDto adviser;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private String purpose;
    private ConsultationStatus status;
    private String notes;
    private String meetingLink;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
