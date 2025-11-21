package com.cit.thesis.service;

import com.cit.thesis.dto.CreateScheduleRequest;
import com.cit.thesis.dto.ScheduleDto;
import com.cit.thesis.model.Schedule;
import com.cit.thesis.model.User;
import com.cit.thesis.repository.ScheduleRepository;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, UserRepository userRepository) {
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
    }

    public List<ScheduleDto> getAvailableSchedules() {
        LocalDate today = LocalDate.now();
        List<Schedule> schedules = scheduleRepository
                .findByIsBookedFalseAndAvailableDateAfterOrderByAvailableDateAsc(today);

        return schedules.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ScheduleDto> getMySchedules(String email) {
        User adviser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Schedule> schedules = scheduleRepository
                .findByAdviserIdOrderByAvailableDateAsc(adviser.getId());

        return schedules.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleDto createSchedule(CreateScheduleRequest request, String email) {
        User adviser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        if (request.getAvailableDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot create schedule for past dates");
        }

        List<Schedule> overlapping = scheduleRepository.findOverlappingSchedules(
                adviser.getId(),
                request.getAvailableDate(),
                request.getStartTime(),
                request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new RuntimeException(
                    "Schedule overlaps with existing schedule on " +
                            request.getAvailableDate() + " at " +
                            overlapping.get(0).getStartTime() + " - " +
                            overlapping.get(0).getEndTime());
        }

        Schedule schedule = new Schedule();
        schedule.setAdviserId(adviser.getId());
        schedule.setAvailableDate(request.getAvailableDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setIsBooked(false);

        schedule = scheduleRepository.save(schedule);
        return mapToDto(schedule);
    }

    @Transactional
    public void deleteSchedule(Long scheduleId, String email) {
        User adviser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getAdviserId().equals(adviser.getId())) {
            throw new RuntimeException("Unauthorized to delete this schedule");
        }

        if (schedule.getIsBooked()) {
            throw new RuntimeException("Cannot delete a booked schedule");
        }

        scheduleRepository.delete(schedule);
    }

    private ScheduleDto mapToDto(Schedule schedule) {
        User adviser = userRepository.findById(schedule.getAdviserId()).orElse(null);

        return new ScheduleDto(
                schedule.getId(),
                schedule.getAdviserId(),
                adviser != null ? adviser.getName() : "Unknown",
                schedule.getAvailableDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getIsBooked());
    }
}