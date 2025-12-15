package com.example.thesis_mobile.navigation

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.thesis_mobile.screens.LoginScreen
import com.example.thesis_mobile.screens.RegisterScreen
import com.example.thesis_mobile.screens.DashboardScreen
import com.example.thesis_mobile.screens.FacultyDashboardScreen
import com.example.thesis_mobile.screens.AdminPanelScreen
import com.example.thesis_mobile.screens.DashboardViewModel
import androidx.lifecycle.viewmodel.compose.viewModel


@Composable
fun AppNavGraph(navController: NavHostController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val sharedPref = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
    val token = sharedPref.getString("JWT_TOKEN", "") ?: ""
    NavHost(
        navController = navController,
        startDestination = "login"
    ) {

        composable("login") {
            LoginScreen(
                onLogin = { navController.navigate("dashboard") },
                onRegisterClick = { navController.navigate("register") }
            )
        }

        composable("register") {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("register") { inclusive = true }
                    }
                },
                onLoginClick = { navController.popBackStack() }
            )
        }

        composable("dashboard") {
            // Get ViewModel
            val viewModel: DashboardViewModel = viewModel()

            val savedToken = sharedPref.getString("JWT_TOKEN", null)
            println("Saved JWT token: $savedToken")
            // Pass ViewModel and token to your screen
            DashboardScreen(viewModel = viewModel, token = token)
        }
        composable("faculty_dashboard") {
            FacultyDashboardScreen()
        }
        composable("admin_panel") {
            AdminPanelScreen()
        }
    }
}
