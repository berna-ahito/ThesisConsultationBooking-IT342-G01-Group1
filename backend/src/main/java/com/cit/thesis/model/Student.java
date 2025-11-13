package com.cit.thesis.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
public class Student extends User {


    @Column(nullable = false)
    private int studentId;

    @Column(nullable = false)
    private int groupId;

    public Student(int studentId, int groupId) {
        super();
        this.studentId = studentId;
        this.groupId = groupId; 
    }

    public Student() {
        super();
    }

      public int getStudentId() {
        return studentId;
    }
    public void setStudentId(int id) {
        this.studentId = studentId;
    }
     public int getGroupId() {
        return groupId;
    }
    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }
    
    
}
