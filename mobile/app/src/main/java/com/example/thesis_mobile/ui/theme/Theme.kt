package com.example.thesis_mobile.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val ColorScheme = lightColorScheme(
    primary = TealPrimary,
    onPrimary = Color.White,
    background = Color.White,
    surface = LightGrayBG,
    onSurface = Color.Black
)

@Composable
fun ThesisMobileTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ColorScheme,
        typography = Typography,   // ← FIXED
        content = content
    )
}
