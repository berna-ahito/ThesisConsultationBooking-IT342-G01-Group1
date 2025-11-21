package com.cit.thesis.controller;

import com.cit.thesis.dto.AddNotesRequest;
import com.cit.thesis.dto.BookConsultationRequest;
import com.cit.thesis.dto.ConsultationDto;
import com.cit.thesis.dto.RejectConsultationRequest;
import com.cit.thesis.service.ConsultationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @GetMapping("/my-consultations")
    public ResponseEntity<?> getMyConsultations(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String email = authentication.getName();
        return ResponseEntity.ok(consultationService.getMyConsultations(email, page, size));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ConsultationDto>> getUpcomingConsultations(Authentication authentication) {
        String email = authentication.getName();
        List<ConsultationDto> consultations = consultationService.getUpcomingConsultations(email);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/past")
    public ResponseEntity<List<ConsultationDto>> getPastConsultations(Authentication authentication) {
        String email = authentication.getName();
        List<ConsultationDto> consultations = consultationService.getPastConsultations(email);
        return ResponseEntity.ok(consultations);
    }

    @PostMapping("/book")
    public ResponseEntity<ConsultationDto> bookConsultation(
            @RequestBody BookConsultationRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        ConsultationDto consultation = consultationService.bookConsultation(request, email);
        return ResponseEntity.ok(consultation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelConsultation(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        consultationService.cancelConsultation(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationDto> getConsultationDetails(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        ConsultationDto consultation = consultationService.getConsultationDetails(id, email);
        return ResponseEntity.ok(consultation);
    }

    // Get pending consultations for faculty adviser
    @GetMapping("/pending")
    public ResponseEntity<List<ConsultationDto>> getPendingConsultations(Authentication authentication) {
        String email = authentication.getName();
        List<ConsultationDto> consultations = consultationService.getPendingConsultationsForAdviser(email);
        return ResponseEntity.ok(consultations);
    }

    // Approve consultation
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveConsultation(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            ConsultationDto consultation = consultationService.approveConsultation(id, email);
            return ResponseEntity.ok(consultation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Reject consultation
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectConsultation(
            @PathVariable Long id,
            @RequestBody RejectConsultationRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            ConsultationDto consultation = consultationService.rejectConsultation(
                    id,
                    request.getRejectionReason(),
                    email);
            return ResponseEntity.ok(consultation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // NEW: Add notes to consultation
    @PostMapping("/{id}/notes")
    public ResponseEntity<?> addConsultationNotes(
            @PathVariable Long id,
            @RequestBody AddNotesRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            ConsultationDto consultation = consultationService.addConsultationNotes(
                    id,
                    request.getNotes(),
                    email);
            return ResponseEntity.ok(consultation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/adviser/consultations")
    public ResponseEntity<List<ConsultationDto>> getConsultationsForAdviser(
            Authentication authentication) {
        String email = authentication.getName();
        List<ConsultationDto> consultations = consultationService.getConsultationsForAdviser(email);
        return ResponseEntity.ok(consultations);
    }

}