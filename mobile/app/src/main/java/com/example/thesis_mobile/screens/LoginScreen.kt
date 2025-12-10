package com.example.thesis_mobile.screens

import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.material3.HorizontalDivider
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
import com.example.thesis_mobile.network.LoginRequest
import com.example.thesis_mobile.network.RetrofitClient
import com.example.thesis_mobile.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onLogin: () -> Unit = {}, onRegisterClick: () -> Unit = {}) {

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Spacer(modifier = Modifier.height(50.dp))

        // Logo
        Image(
            painter = painterResource(id = R.drawable.ic_thesis_hub_logo),
            contentDescription = null,
            modifier = Modifier.size(100.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            "ThesisHub",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold
        )

        Text(
            "Book your consultation sessions",
            fontSize = 14.sp,
            color = GrayText
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Card container
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = LightGrayBG),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {

                Text("Login", fontSize = 20.sp, fontWeight = FontWeight.Bold)

                Spacer(modifier = Modifier.height(16.dp))

                // Email
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TealPrimary,
                        unfocusedBorderColor = BorderGray
                    )
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Password
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TealPrimary,
                        unfocusedBorderColor = BorderGray
                    )
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    Text(
                        "Forgot password?",
                        color = TealPrimary,
                        fontSize = 14.sp
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Sign in button
                Button(
                    onClick = {
                        scope.launch {
                            if (email.isBlank() || password.isBlank()) {
                                Toast.makeText(context, "Please enter email and password", Toast.LENGTH_SHORT).show()
                                return@launch
                            }

                            try {
                                val request = LoginRequest(email = email, password = password)
                                val response = RetrofitClient.apiService.login(request)

                                if (response.isSuccessful) { // fixed typo
                                    val authResponse = response.body()
                                    if (authResponse != null) {
                                        val token = authResponse.token
                                        val role = authResponse.role
                                        val userId = authResponse.userId

                                        // TODO: Save token for future authenticated calls
                                        // Example: SharedPreferences or DataStore

                                        Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                                        val sharedPref = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
                                        with(sharedPref.edit()) {
                                            putString("JWT_TOKEN", token)
                                            apply()
                                        }
                                        val savedToken = sharedPref.getString("JWT_TOKEN", null)
                                        println("Saved JWT token: $savedToken")
                                        onLogin() // Navigate to home/events screen
                                    }
                                } else {
                                    val error = response.errorBody()?.string()
                                    Toast.makeText(context, "Login failed: $error", Toast.LENGTH_SHORT).show()
                                }
                            } catch (e: Exception) {
                                Toast.makeText(context, "Login error: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
                            }
                        }

                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(TealPrimary)
                ) {
                    Text("Sign In", color = Color.White)
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Divider
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    HorizontalDivider(modifier = Modifier.weight(1f))
                    Text("  or  ", fontSize = 14.sp, color = GrayText)
                    HorizontalDivider(modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Google Button
                OutlinedButton(
                    onClick = { },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_google),
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Continue with Google")
                }

                Spacer(modifier = Modifier.height(18.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text("Don't have an account? ", color = GrayText)
                    Text(
                        "Register",
                        color = TealPrimary,
                        modifier = Modifier.clickable { onRegisterClick() }
                    )
                }
            }
        }
    }
}
