package com.cit.thesis.controller;

import com.cit.thesis.dto.CreateScheduleRequest;
import com.cit.thesis.dto.ScheduleDto;
import com.cit.thesis.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<ScheduleDto>> getAvailableSchedules() {
        List<ScheduleDto> schedules = scheduleService.getAvailableSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/my-schedules")
    public ResponseEntity<List<ScheduleDto>> getMySchedules(Authentication authentication) {
        String email = authentication.getName();
        List<ScheduleDto> schedules = scheduleService.getMySchedules(email);
        return ResponseEntity.ok(schedules);
    }

    @PostMapping
    public ResponseEntity<ScheduleDto> createSchedule(
            @RequestBody CreateScheduleRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        ScheduleDto schedule = scheduleService.createSchedule(request, email);
        return ResponseEntity.ok(schedule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        scheduleService.deleteSchedule(id, email);
        return ResponseEntity.noContent().build();
    }
}