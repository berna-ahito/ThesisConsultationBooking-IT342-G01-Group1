package com.cit.thesis.repository;

import com.cit.thesis.model.Consultation;
import com.cit.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByStudentOrderByScheduledStartDesc(User student);
    List<Consultation> findByAdviserOrderByScheduledStartDesc(User adviser);
    
    @Query("SELECT c FROM Consultation c WHERE " +
           "(c.student = :user OR c.adviser = :user) AND " +
           "c.scheduledStart >= :start AND c.scheduledStart < :end")
    List<Consultation> findUserConsultationsInRange(
        @Param("user") User user,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Consultation c " +
           "WHERE c.adviser = :adviser AND " +
           "((c.scheduledStart <= :end AND c.scheduledEnd >= :start) OR " +
           "(c.scheduledStart >= :start AND c.scheduledStart < :end))")
    boolean hasOverlappingConsultation(
        @Param("adviser") User adviser,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}