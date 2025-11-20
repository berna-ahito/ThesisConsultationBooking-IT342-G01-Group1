package com.example.thesisconsultation.network

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

data class RegisterRequestFaculty(
    val email: String,
    val name: String,
    val password: String,
    val department: String,
    val facultyId: Int,
    val institutionId: Int,
    val isAvailable: Boolean
)

data class RegisterResponse(
    val token: String,
    val role: String,
    val userId: String
)

interface ApiService {
    @POST("api/auth/registerFaculty")
    suspend fun register(@Body request: RegisterRequestFaculty): Response<RegisterResponse>
}