package com.example.thesis_mobile.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.thesis_mobile.network.RetrofitClient
import com.example.thesis_mobile.network.UserDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class DashboardViewModel : ViewModel() {
    private val _profile = MutableStateFlow<UserDto?>(null)
    val profile: StateFlow<UserDto?> = _profile

    fun fetchProfile(token: String) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.apiService.getProfile("Bearer $token")
                if (response.isSuccessful) {
                    _profile.value = response.body()
                } else {
                    // Handle error (optional)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
