package com.cit.thesis.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentApiController {

    @GetMapping("/consultations")
    public ResponseEntity<List<Map<String, Object>>> getConsultations() {
        List<Map<String, Object>> data = List.of(
                Map.of("id", 1, "topic", "Thesis Scope", "status", "PENDING", "date", "2025-11-20T10:00:00"),
                Map.of("id", 2, "topic", "Methodology", "status", "APPROVED", "date", "2025-11-22T14:00:00")
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Map<String, Object>>> getSchedule() {
        List<Map<String, Object>> data = List.of(
                Map.of("id", 1, "slot", "2025-11-20T10:00:00", "adviser", "Dr. Smith"),
                Map.of("id", 2, "slot", "2025-11-22T14:00:00", "adviser", "Prof. Reyes")
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Map<String, Object>>> getMessages() {
        List<Map<String, Object>> data = List.of(
                Map.of("id", 1, "from", "Dr. Smith", "subject", "Consultation update", "unread", true),
                Map.of("id", 2, "from", "Office", "subject", "Schedule confirmed", "unread", false)
        );
        return ResponseEntity.ok(data);
    }
}
