package com.cit.thesis.dto;

public class RejectConsultationRequest {
    private Long consultationId;
    private String rejectionReason;

    public RejectConsultationRequest() {
    }

    public RejectConsultationRequest(Long consultationId, String rejectionReason) {
        this.consultationId = consultationId;
        this.rejectionReason = rejectionReason;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}