package com.example.thesis_mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.rememberNavController
import com.example.thesis_mobile.navigation.AppNavGraph
import com.example.thesis_mobile.ui.theme.ThesisMobileTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ThesisMobileTheme {
                val navController = rememberNavController()
                AppNavGraph(navController)
            }
        }
    }
}
