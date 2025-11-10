package com.cit.thesis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequest {
    private Long adviserId;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private String purpose;
}
