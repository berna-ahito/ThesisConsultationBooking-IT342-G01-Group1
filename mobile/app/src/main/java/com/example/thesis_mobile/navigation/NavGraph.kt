package com.example.thesis_mobile.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.thesis_mobile.screens.LoginScreen
import com.example.thesis_mobile.screens.RegisterScreen
import com.example.thesis_mobile.screens.DashboardScreen
import com.example.thesis_mobile.screens.FacultyDashboardScreen
import com.example.thesis_mobile.screens.AdminPanelScreen

@Composable
fun AppNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "admin_panel"
    ) {

        composable("login") {
            LoginScreen(
                onLogin = { navController.navigate("dashboard") },
                onRegisterClick = { navController.navigate("register") }
            )
        }

        composable("register") {
            RegisterScreen(
                onRegister = { navController.navigate("dashboard") },
                onLoginClick = { navController.popBackStack() }
            )
        }

        composable("dashboard") {
            DashboardScreen()
        }
        composable("faculty_dashboard") {
            FacultyDashboardScreen()
        }
        composable("admin_panel") {
            AdminPanelScreen()
        }
    }
}
