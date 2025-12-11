package com.cit.thesis.repository;

import com.cit.thesis.model.Consultation;
import com.cit.thesis.model.ConsultationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    Page<Consultation> findByStudentIdOrderByScheduledDateDesc(Long studentId, Pageable pageable);

    @Query("SELECT c FROM Consultation c WHERE c.studentId = :studentId AND c.scheduledDate >= :date ORDER BY c.scheduledDate ASC")
    List<Consultation> findUpcomingConsultationsFromDate(@Param("studentId") Long studentId,
            @Param("date") LocalDate date);
}