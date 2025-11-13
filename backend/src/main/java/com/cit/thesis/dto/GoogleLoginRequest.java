package com.cit.thesis.dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String credential;

    public String getCredential() {
        return credential;
    }
}