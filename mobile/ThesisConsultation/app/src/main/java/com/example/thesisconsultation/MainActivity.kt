package com.example.thesisconsultation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.thesisconsultation.ui.screens.RegisterScreen
import com.example.thesisconsultation.ui.theme.ThesisConsultationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ThesisConsultationTheme {
                val navController = rememberNavController() // create NavController

                NavHost(
                    navController = navController,
                    startDestination = "main"
                ) {
                    composable("main") {
                        MainScreen(navController)
                    }
                    composable("register") {
                        RegisterScreen(navController) { request ->
                            // Call your Retrofit API here
                            println("Register request: $request")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MainScreen(navController: androidx.navigation.NavController) {
    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Text(text = "Hello Android!")
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = { navController.navigate("register") }) {
                Text("Go to Register")
            }
        }
    }
}
