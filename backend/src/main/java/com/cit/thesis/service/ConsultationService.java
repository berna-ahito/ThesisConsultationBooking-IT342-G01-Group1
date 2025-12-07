package com.cit.thesis.service;

import com.cit.thesis.dto.BookConsultationRequest;
import com.cit.thesis.dto.ConsultationDto;
import com.cit.thesis.model.Consultation;
import com.cit.thesis.model.ConsultationStatus;
import com.cit.thesis.model.Schedule;
import com.cit.thesis.model.User;
import com.cit.thesis.repository.ConsultationRepository;
import com.cit.thesis.repository.ScheduleRepository;
import com.cit.thesis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.cit.thesis.dto.PagedResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

        private final ConsultationRepository consultationRepository;
        private final ScheduleRepository scheduleRepository;
        private final UserRepository userRepository;
        private final AuditLogService auditLogService;

        public ConsultationService(ConsultationRepository consultationRepository,
                        ScheduleRepository scheduleRepository,
                        UserRepository userRepository,
                        AuditLogService auditLogService) {
                this.consultationRepository = consultationRepository;
                this.scheduleRepository = scheduleRepository;
                this.userRepository = userRepository;
                this.auditLogService = auditLogService;
        }

        public List<ConsultationDto> getMyConsultations(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Consultation> consultations = consultationRepository
                                .findByStudentIdOrderByScheduledDateDesc(user.getId());

                return consultations.stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<ConsultationDto> getUpcomingConsultations(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LocalDate today = LocalDate.now();
                List<Consultation> consultations = consultationRepository
                                .findByStudentIdAndScheduledDateAfterOrderByScheduledDateAsc(user.getId(), today);

                return consultations.stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<ConsultationDto> getPastConsultations(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LocalDate today = LocalDate.now();
                List<Consultation> consultations = consultationRepository
                                .findByStudentIdAndScheduledDateBeforeOrderByScheduledDateDesc(user.getId(), today);

                return consultations.stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public PagedResponse<ConsultationDto> getMyConsultations(String email, int page, int size) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Pageable pageable = PageRequest.of(page, size);
                Page<Consultation> consultationPage = consultationRepository
                                .findByStudentIdOrderByScheduledDateDesc(user.getId(), pageable);

                List<ConsultationDto> dtos = consultationPage.getContent().stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());

                return new PagedResponse<>(
                                dtos,
                                consultationPage.getNumber(),
                                consultationPage.getTotalPages(),
                                consultationPage.getTotalElements(),
                                consultationPage.getSize(),
                                consultationPage.isFirst(),
                                consultationPage.isLast());
        }

        @Transactional
        public ConsultationDto bookConsultation(BookConsultationRequest request, String email) {
                User student = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (student.getTeamCode() == null || student.getTeamCode().isBlank()) {
                        throw new RuntimeException("Student must have a team code to book consultations");
                }

                Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                                .orElseThrow(() -> new RuntimeException("Schedule not found"));

                if (schedule.getIsBooked()) {
                        throw new RuntimeException("This time slot is already booked");
                }

                User adviser = userRepository.findById(schedule.getAdviserId())
                                .orElseThrow(() -> new RuntimeException("Adviser not found"));

                Consultation consultation = new Consultation();
                consultation.setStudentId(student.getId());
                consultation.setTeamCode(student.getTeamCode());
                consultation.setAdviserId(adviser.getId());
                consultation.setScheduleId(schedule.getId());
                consultation.setTopic(request.getTopic());
                consultation.setDescription(request.getDescription());
                consultation.setScheduledDate(schedule.getAvailableDate());
                consultation.setStartTime(schedule.getStartTime());
                consultation.setScheduledEnd(schedule.getEndTime());
                consultation.setStatus(ConsultationStatus.PENDING);

                consultation = consultationRepository.save(consultation);

                schedule.setIsBooked(true);
                scheduleRepository.save(schedule);

                // Log consultation booking
                auditLogService.log(
                                student.getId(),
                                student.getEmail(),
                                "CONSULTATION_BOOKED",
                                "Consultation",
                                consultation.getId(),
                                "Booked consultation with " + adviser.getName() + " on " + schedule.getAvailableDate(),
                                null);

                return mapToDto(consultation);

        }

        @Transactional
        public void cancelConsultation(Long consultationId, String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Consultation consultation = consultationRepository.findById(consultationId)
                                .orElseThrow(() -> new RuntimeException("Consultation not found"));

                if (!consultation.getStudentId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized to cancel this consultation");
                }

                if (consultation.getStatus() == ConsultationStatus.COMPLETED) {
                        throw new IllegalStateException("Cannot cancel completed consultation");
                }

                if (consultation.getStatus() == ConsultationStatus.CANCELLED) {
                        throw new IllegalStateException("Consultation is already cancelled");
                }

                if (consultation.getStatus() == ConsultationStatus.REJECTED) {
                        throw new IllegalStateException("Cannot cancel rejected consultation");
                }

                // Prevent cancellation if consultation is within 24 hours
                if (consultation.getScheduledDate().equals(LocalDate.now()) ||
                                consultation.getScheduledDate().isBefore(LocalDate.now())) {
                        throw new IllegalStateException("Cannot cancel consultation on the same day or past dates");
                }

                Schedule schedule = scheduleRepository.findById(consultation.getScheduleId())
                                .orElse(null);
                if (schedule != null) {
                        schedule.setIsBooked(false);
                        scheduleRepository.save(schedule);
                }

                consultation.setStatus(ConsultationStatus.CANCELLED);
                consultationRepository.save(consultation);

                // Log cancellation
                auditLogService.log(
                                user.getId(),
                                user.getEmail(),
                                "CONSULTATION_CANCELLED",
                                "Consultation",
                                consultation.getId(),
                                "Cancelled consultation on " + consultation.getScheduledDate(),
                                null);
        }

        public ConsultationDto getConsultationDetails(Long consultationId, String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Consultation consultation = consultationRepository.findById(consultationId)
                                .orElseThrow(() -> new RuntimeException("Consultation not found"));

                if (!consultation.getStudentId().equals(user.getId()) &&
                                !consultation.getAdviserId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized to view this consultation");
                }

                return mapToDto(consultation);
        }

        // Get pending consultations for adviser
        public List<ConsultationDto> getPendingConsultationsForAdviser(String email) {
                User adviser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Consultation> consultations = consultationRepository
                                .findByAdviserIdOrderByScheduledDateDesc(adviser.getId());

                return consultations.stream()
                                .filter(c -> c.getStatus() == ConsultationStatus.PENDING)
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        // Approve consultation
        @Transactional
        public ConsultationDto approveConsultation(Long consultationId, String email) {
                User adviser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Consultation consultation = consultationRepository.findById(consultationId)
                                .orElseThrow(() -> new RuntimeException("Consultation not found"));

                if (!consultation.getAdviserId().equals(adviser.getId())) {
                        throw new RuntimeException("Unauthorized to approve this consultation");
                }

                if (consultation.getStatus() != ConsultationStatus.PENDING) {
                        throw new RuntimeException("Only pending consultations can be approved");
                }

                consultation.setStatus(ConsultationStatus.APPROVED);
                consultation = consultationRepository.save(consultation);

                // Log approval
                auditLogService.log(
                                adviser.getId(),
                                adviser.getEmail(),
                                "CONSULTATION_APPROVED",
                                "Consultation",
                                consultation.getId(),
                                "Approved consultation with student ID " + consultation.getStudentId(),
                                null);

                return mapToDto(consultation);
        }

        // Reject consultation
        @Transactional
        public ConsultationDto rejectConsultation(Long consultationId, String rejectionReason, String email) {
                User adviser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Consultation consultation = consultationRepository.findById(consultationId)
                                .orElseThrow(() -> new RuntimeException("Consultation not found"));

                if (!consultation.getAdviserId().equals(adviser.getId())) {
                        throw new RuntimeException("Unauthorized to reject this consultation");
                }

                if (consultation.getStatus() != ConsultationStatus.PENDING) {
                        throw new RuntimeException("Only pending consultations can be rejected");
                }

                // Free up the schedule slot
                Schedule schedule = scheduleRepository.findById(consultation.getScheduleId())
                                .orElse(null);
                if (schedule != null) {
                        schedule.setIsBooked(false);
                        scheduleRepository.save(schedule);
                }

                consultation.setStatus(ConsultationStatus.REJECTED);
                consultation.setRejectionReason(rejectionReason);
                consultation = consultationRepository.save(consultation);

                // Log rejection
                auditLogService.log(
                                adviser.getId(),
                                adviser.getEmail(),
                                "CONSULTATION_REJECTED",
                                "Consultation",
                                consultation.getId(),
                                "Rejected consultation. Reason: " + rejectionReason,
                                null);

                return mapToDto(consultation);
        }

        @Transactional
        public ConsultationDto addConsultationNotes(Long consultationId, String notes, String email) {
                User adviser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Consultation consultation = consultationRepository.findById(consultationId)
                                .orElseThrow(() -> new RuntimeException("Consultation not found"));

                if (!consultation.getAdviserId().equals(adviser.getId())) {
                        throw new RuntimeException("Unauthorized to add notes to this consultation");
                }

                consultation.setAdviserNotes(notes);

                // If approved and notes added, mark as completed
                if (consultation.getStatus() == ConsultationStatus.APPROVED) {
                        consultation.setStatus(ConsultationStatus.COMPLETED);
                        consultation.setCompletedAt(java.time.LocalDateTime.now());
                }

                consultation = consultationRepository.save(consultation);

                // Log notes addition
                auditLogService.log(
                                adviser.getId(),
                                adviser.getEmail(),
                                "CONSULTATION_NOTES_ADDED",
                                "Consultation",
                                consultation.getId(),
                                "Added notes and marked as completed",
                                null);

                return mapToDto(consultation);
        }

        private ConsultationDto mapToDto(Consultation consultation) {
                User student = userRepository.findById(consultation.getStudentId()).orElse(null);
                User adviser = userRepository.findById(consultation.getAdviserId()).orElse(null);

                ConsultationDto dto = new ConsultationDto(
                                consultation.getId(),
                                consultation.getStudentId(),
                                student != null ? student.getName() : "Unknown",
                                consultation.getTeamCode(),
                                consultation.getAdviserId(),
                                adviser != null ? adviser.getName() : "Unknown",
                                consultation.getTopic(),
                                consultation.getDescription(),
                                consultation.getScheduledDate(),
                                consultation.getStartTime(),
                                consultation.getScheduledEnd(),
                                consultation.getStatus().name(),
                                consultation.getAdviserNotes(),
                                consultation.getRejectionReason());

                // Set picture URLs
                if (student != null) {
                        dto.setStudentPictureUrl(student.getPictureUrl());
                }
                if (adviser != null) {
                        dto.setAdviserPictureUrl(adviser.getPictureUrl());
                }

                return dto;
        }

        public List<ConsultationDto> getConsultationsForAdviser(String email) {
                User adviser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Consultation> consultations = consultationRepository
                                .findByAdviserIdOrderByScheduledDateDesc(adviser.getId());

                return consultations.stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

}