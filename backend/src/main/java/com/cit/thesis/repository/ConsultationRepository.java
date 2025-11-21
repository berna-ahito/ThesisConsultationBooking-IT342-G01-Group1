package com.cit.thesis.repository;

import com.cit.thesis.model.Consultation;
import com.cit.thesis.model.ConsultationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByStudentIdOrderByScheduledDateDesc(Long studentId);

    List<Consultation> findByAdviserIdOrderByScheduledDateDesc(Long adviserId);

    List<Consultation> findByStudentIdAndStatusOrderByScheduledDateAsc(Long studentId, ConsultationStatus status);

    List<Consultation> findByStudentIdAndScheduledDateAfterOrderByScheduledDateAsc(Long studentId, LocalDate date);

    List<Consultation> findByStudentIdAndScheduledDateBeforeOrderByScheduledDateDesc(Long studentId, LocalDate date);

    List<Consultation> findByAdviserIdAndStatusNotOrderByScheduledDateDesc(
            Long adviserId,
            ConsultationStatus status);

    long countByStudentId(Long studentId);

    long countByAdviserId(Long adviserId);

}