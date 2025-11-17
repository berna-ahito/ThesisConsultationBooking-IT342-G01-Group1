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

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

        private final ConsultationRepository consultationRepository;
        private final ScheduleRepository scheduleRepository;
        private final UserRepository userRepository;

        public ConsultationService(ConsultationRepository consultationRepository,
                        ScheduleRepository scheduleRepository,
                        UserRepository userRepository) {
                this.consultationRepository = consultationRepository;
                this.scheduleRepository = scheduleRepository;
                this.userRepository = userRepository;
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
                        throw new RuntimeException("Cannot cancel completed consultation");
                }

                Schedule schedule = scheduleRepository.findById(consultation.getScheduleId())
                                .orElse(null);
                if (schedule != null) {
                        schedule.setIsBooked(false);
                        scheduleRepository.save(schedule);
                }

                consultation.setStatus(ConsultationStatus.CANCELLED);
                consultationRepository.save(consultation);
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

                return mapToDto(consultation);
        }

        private ConsultationDto mapToDto(Consultation consultation) {
                User student = userRepository.findById(consultation.getStudentId()).orElse(null);
                User adviser = userRepository.findById(consultation.getAdviserId()).orElse(null);

                return new ConsultationDto(
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
                                consultation.getAdviserNotes());
        }
}