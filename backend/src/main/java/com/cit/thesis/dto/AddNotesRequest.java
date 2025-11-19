package com.cit.thesis.dto;

public class AddNotesRequest {
    private Long consultationId;
    private String notes;

    public AddNotesRequest() {
    }

    public AddNotesRequest(Long consultationId, String notes) {
        this.consultationId = consultationId;
        this.notes = notes;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}