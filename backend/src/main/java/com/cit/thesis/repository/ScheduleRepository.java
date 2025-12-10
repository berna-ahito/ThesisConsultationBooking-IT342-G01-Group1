package com.cit.thesis.repository;

import com.cit.thesis.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
        List<Schedule> findByAdviserIdOrderByAvailableDateAsc(Long adviserId);

        List<Schedule> findByIsBookedFalseAndAvailableDateAfterOrderByAvailableDateAsc(LocalDate date);

        @Query("SELECT s FROM Schedule s WHERE s.isBooked = false AND s.availableDate >= :date ORDER BY s.availableDate ASC")
        List<Schedule> findAvailableSchedulesFromDate(@Param("date") LocalDate date);

        Page<Schedule> findByAdviserIdOrderByAvailableDateAsc(Long adviserId, Pageable pageable);

        @Query("SELECT s FROM Schedule s WHERE s.adviserId = :adviserId " +
                        "AND s.availableDate = :date " +
                        "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
        List<Schedule> findOverlappingSchedules(
                        @Param("adviserId") Long adviserId,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.adviserId = :adviserId " +
                        "AND s.availableDate = :date " +
                        "AND s.id != :excludeId " +
                        "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
        boolean hasOverlapExcludingSchedule(
                        @Param("adviserId") Long adviserId,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime,
                        @Param("excludeId") Long excludeId);
}