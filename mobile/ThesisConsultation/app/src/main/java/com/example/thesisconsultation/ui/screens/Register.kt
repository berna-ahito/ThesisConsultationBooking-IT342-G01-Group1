package com.example.thesisconsultation.ui.screens

import android.content.Context
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.thesisconsultation.network.RegisterRequestFaculty
import com.example.thesisconsultation.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun RegisterScreen(navController: NavController, onRegister: (RegisterRequestFaculty) -> Unit) {
    var email by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var department by remember { mutableStateOf("") }
    var facultyId by remember { mutableStateOf("") }
    var institutionId by remember { mutableStateOf("") }
    var isAvailable by remember { mutableStateOf(true) }
    val context = LocalContext.current

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text("Faculty Registration", style = MaterialTheme.typography.titleLarge)

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") }
        )
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") }
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") }
        )
        OutlinedTextField(
            value = department,
            onValueChange = { department = it },
            label = { Text("Department") }
        )
        OutlinedTextField(
            value = facultyId,
            onValueChange = { facultyId = it },
            label = { Text("Faculty ID") }
        )
        OutlinedTextField(
            value = institutionId,
            onValueChange = { institutionId = it },
            label = { Text("Institution ID") }
        )

        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(
                checked = isAvailable,
                onCheckedChange = { isAvailable = it }
            )
            Text("Available")
        }

        Button(onClick = {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val request = RegisterRequestFaculty(
                        email = email,
                        name = name,
                        password = password,
                        department = department,
                        facultyId = facultyId.toIntOrNull() ?: 0,
                        institutionId = institutionId.toIntOrNull() ?: 0,
                        isAvailable = isAvailable
                    )
                    val response = RetrofitClient.apiService.register(request)
                    onRegister(request)
                    val loginResponse = response.body()
                    println("Login Success: ${loginResponse?.userId}")

                    withContext(Dispatchers.Main) {
                        if (response.isSuccessful) {
                            val loginResponse = response.body()
                            println("Register Success: ${loginResponse?.token}")
                            val sharedPref = context.getSharedPreferences(
                                "auth_prefs",
                                Context.MODE_PRIVATE
                            )
                            onRegister(request)
                        } else {
                            println("Register Failed: ${response.code()}")
                        }
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        println("Register Error: ${e.localizedMessage}")
                    }
                }
                }
        }) {
            Text("Register")
        }
    }
}
