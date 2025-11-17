package com.cit.thesis.repository;

import com.cit.thesis.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByAdviserIdOrderByAvailableDateAsc(Long adviserId);

    List<Schedule> findByIsBookedFalseAndAvailableDateAfterOrderByAvailableDateAsc(LocalDate date);
}