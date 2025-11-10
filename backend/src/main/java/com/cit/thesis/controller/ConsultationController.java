package com.cit.thesis.controller;

import com.cit.thesis.dto.ConsultationRequest;
import com.cit.thesis.dto.ConsultationResponse;
import com.cit.thesis.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationService consultationService;

    @PostMapping("/book")
    public ResponseEntity<ConsultationResponse> bookConsultation(
            @RequestBody ConsultationRequest request,
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(consultationService.bookConsultation(request, principal.getAttribute("email")));
    }

    @GetMapping("/student")
    public ResponseEntity<List<ConsultationResponse>> getStudentConsultations(
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(consultationService.getStudentConsultations(principal.getAttribute("email")));
    }

    @GetMapping("/adviser")
    public ResponseEntity<List<ConsultationResponse>> getAdviserConsultations(
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(consultationService.getAdviserConsultations(principal.getAttribute("email")));
    }

    @GetMapping("/range")
    public ResponseEntity<List<ConsultationResponse>> getConsultationsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(consultationService.getUserConsultationsInRange(start, end));
    }
}