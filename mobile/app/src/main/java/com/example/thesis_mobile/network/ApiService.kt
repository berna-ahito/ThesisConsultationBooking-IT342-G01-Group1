package com.example.thesis_mobile.network

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

data class RegisterRequest(
    val email: String,
    val name: String,
    val password: String

)
data class UserDto(
    val id: Long,
    val email: String,
    val name: String,
    val pictureUrl: String?,
    val role: String?,
    val isProfileComplete: Boolean?,
    val studentId: String?,
    val facultyId: String?,
    val teamCode: String?,
    val department: String?,
    val accountStatus: String?
)

data class RegisterResponse(
    val token: String,
    val role: String,
    val userId: String
)
data class CompleteProfileRequest(
    val role: String,
    @SerializedName("studentId") val studentId: String,
    @SerializedName("teamCode") val teamCode: String,
    @SerializedName("department") val department: String
)
data class LoginRequest(
    val email: String,
    val password: String
)
data class AuthResponse(
    val token: String,
    val role: String,
    val userId: Long
)


interface ApiService {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>
    @POST("api/auth/complete-profile")
    suspend fun completeProfile(
        @Header("Authorization") token: String,  // Pass token here
        @Body request: CompleteProfileRequest
    ): Response<RegisterResponse>
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    @GET("api/users/profile")
    suspend fun getProfile(
        @Header("Authorization") token: String
    ): Response<UserDto>
}