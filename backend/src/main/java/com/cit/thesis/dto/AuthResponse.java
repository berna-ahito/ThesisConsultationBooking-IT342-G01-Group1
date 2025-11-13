package com.cit.thesis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

     public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
}