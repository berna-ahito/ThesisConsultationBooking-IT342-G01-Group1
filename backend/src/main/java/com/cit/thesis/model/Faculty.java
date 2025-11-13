package com.cit.thesis.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
public class Faculty extends User {


    @Column(nullable = false)
    private int facultyId;

    @Column(nullable = false)
    private boolean isAvailable;

    public Faculty(int facultyId, boolean isAvailable) {
        super();
        this.facultyId = facultyId;
        this.isAvailable = isAvailable; 
    }
    public Faculty() {
        super();
    }

      public int getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(int id) {
        this.facultyId = facultyId;
    }
     public boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    
}
