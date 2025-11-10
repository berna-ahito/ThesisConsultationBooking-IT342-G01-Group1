package com.cit.thesis.service;

import com.cit.thesis.dto.ConsultationRequest;
import com.cit.thesis.dto.ConsultationResponse;
import com.cit.thesis.model.Consultation;
import com.cit.thesis.model.ConsultationStatus;
import com.cit.thesis.model.User;
import com.cit.thesis.repository.ConsultationRepository;
import com.cit.thesis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;

    @Transactional
    public ConsultationResponse bookConsultation(ConsultationRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        User adviser = userRepository.findById(request.getAdviserId())
                .orElseThrow(() -> new RuntimeException("Adviser not found"));

        // Validate the time slot
        if (consultationRepository.hasOverlappingConsultation(
                adviser, request.getScheduledStart(), request.getScheduledEnd())) {
            throw new RuntimeException("Time slot is already booked");
        }

        Consultation consultation = Consultation.builder()
            .student(student)
            .adviser(adviser)
            .scheduledStart(request.getScheduledStart())
            .scheduledEnd(request.getScheduledEnd())
            .purpose(request.getPurpose())
            .status(ConsultationStatus.PENDING)
            .build();

        consultation = consultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    public List<ConsultationResponse> getStudentConsultations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return consultationRepository.findByStudentOrderByScheduledStartDesc(student)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ConsultationResponse> getAdviserConsultations(String adviserEmail) {
        User adviser = userRepository.findByEmail(adviserEmail)
                .orElseThrow(() -> new RuntimeException("Adviser not found"));
        return consultationRepository.findByAdviserOrderByScheduledStartDesc(adviser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ConsultationResponse> getUserConsultationsInRange(
            LocalDateTime start, LocalDateTime end) {
        // This endpoint is intended to be called with the current user's email
        // resolved in the controller; here we will just fetch by email when provided
        // via a security principal in the controller layer.
        // For now, the controller calls this method after resolving the user.
        throw new UnsupportedOperationException("Use getStudentConsultations or getAdviserConsultations instead.");
    }

    private ConsultationResponse mapToResponse(Consultation consultation) {
        return ConsultationResponse.builder()
                .id(consultation.getId())
                .student(convertToDto(consultation.getStudent()))
                .adviser(convertToDto(consultation.getAdviser()))
                .scheduledStart(consultation.getScheduledStart())
                .scheduledEnd(consultation.getScheduledEnd())
                .purpose(consultation.getPurpose())
                .status(consultation.getStatus())
                .notes(consultation.getNotes())
                .meetingLink(consultation.getMeetingLink())
                .createdAt(consultation.getCreatedAt())
                .updatedAt(consultation.getUpdatedAt())
                .build();
    }

    private com.cit.thesis.dto.UserDto convertToDto(User user) {
        if (user == null) return null;
        return new com.cit.thesis.dto.UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getIsProfileComplete(),
                user.getStudentId(),
                user.getDepartment(),
                user.getAccountStatus()
        );
    }
}