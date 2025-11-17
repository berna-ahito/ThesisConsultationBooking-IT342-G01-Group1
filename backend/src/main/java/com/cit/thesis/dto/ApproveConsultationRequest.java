package com.cit.thesis.dto;

public class ApproveConsultationRequest {
    private Long consultationId;

    public ApproveConsultationRequest() {
    }

    public ApproveConsultationRequest(Long consultationId) {
        this.consultationId = consultationId;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }
}