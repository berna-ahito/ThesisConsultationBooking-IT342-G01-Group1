package com.example.thesis_mobile.screens

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.thesis_mobile.R
import com.example.thesis_mobile.network.CompleteProfileRequest
import com.example.thesis_mobile.network.RegisterRequest
import com.example.thesis_mobile.network.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit = {},
    onLoginClick: () -> Unit = {}
) {

    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var studentId by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Spacer(modifier = Modifier.height(40.dp))

        Image(
            painter = painterResource(id = R.drawable.ic_thesis_hub_logo),
            contentDescription = null,
            modifier = Modifier.size(80.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text("ThesisHub", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Text(
            "Join the thesis consultation platform",
            fontSize = 14.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF5F5F5)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {

                Text("Register", fontSize = 20.sp, fontWeight = FontWeight.Bold)

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Name") },
                    placeholder = { Text("John Doe") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    placeholder = { Text("your.email@university.edu") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = studentId,
                    onValueChange = { studentId = it },
                    label = { Text("Student ID") },
                    placeholder = { Text("2024-00000") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    placeholder = { Text("••••••••") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    label = { Text("Confirm Password") },
                    placeholder = { Text("••••••••") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        scope.launch {

                            // Validate input
                            if (fullName.isEmpty() || email.isEmpty() || password.isEmpty() || studentId.isEmpty()) {
                                Toast.makeText(context, "Fill out all required fields", Toast.LENGTH_SHORT).show()
                                return@launch
                            }
                            if (password != confirmPassword) {
                                Toast.makeText(context, "Passwords do not match!", Toast.LENGTH_SHORT).show()
                                return@launch
                            }

                            val registerRequest = RegisterRequest(
                                email = email,
                                name = fullName,
                                password = password
                            )

                            // ✅ FIRST API CALL: Register
                            val registerResponse = RetrofitClient.apiService.register(registerRequest)

                            if (registerResponse.isSuccessful) {
                                val token = registerResponse.body()?.token

                                if (token.isNullOrEmpty()) {
                                    Toast.makeText(context, "Failed to get token after registration", Toast.LENGTH_SHORT).show()
                                    return@launch
                                }
                                val teamCode = "23"
                                val formattedTeamCode = "TEAM-${teamCode.trim()}"
                                // Build complete-profile request
                                val profileRequest = CompleteProfileRequest(
                                    role = "STUDENT_REP",
                                    studentId = studentId,
                                    teamCode = formattedTeamCode,
                                    department = "CCS"

                                )


                                // ✅ SECOND API CALL: Complete Profile with token
                                val completeResponse =
                                    RetrofitClient.apiService.completeProfile("Bearer $token", profileRequest)

                                if (completeResponse.isSuccessful) {
                                    Toast.makeText(context, "Registration Complete!", Toast.LENGTH_SHORT).show()
                                    onRegisterSuccess()
                                } else {
                                    Toast.makeText(context, "Profile completion failed", Toast.LENGTH_SHORT).show()
                                }

                            } else {
                                Toast.makeText(context, "Registration Failed", Toast.LENGTH_SHORT).show()
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF009688))
                ) {
                    Text("Create Account", color = Color.White)
                }

                Spacer(modifier = Modifier.height(18.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text("Already have an account? ", color = Color.Gray)
                    Text(
                        "Login",
                        color = Color(0xFF009688),
                        modifier = Modifier.clickable { onLoginClick() }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}
