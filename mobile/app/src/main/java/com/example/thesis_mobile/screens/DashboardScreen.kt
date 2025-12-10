package com.example.thesis_mobile.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.thesis_mobile.network.UserDto
import com.example.thesis_mobile.ui.theme.*

@Composable
fun DashboardScreen(viewModel: DashboardViewModel, token: String) {
    val profile by viewModel.profile.collectAsState()

    // Fetch profile when the screen is first composed or token changes
    LaunchedEffect(token) {
        viewModel.fetchProfile(token)
    }

    var selectedTab by remember { mutableStateOf("home") }

    when (selectedTab) {
        "upcoming" -> UpcomingScreen { selectedTab = it }
        "book" -> BookScreen { selectedTab = it }
        "history" -> HistoryScreen { selectedTab = it }
        else -> HomeTabContent(profile, selectedTab) { selectedTab = it }
    }
}

@Composable
fun HomeTabContent(profile: UserDto?, selectedTab: String, onTabChange: (String) -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F7FA))
    ) {
        // Header: Avatar + Thesis Progress + Profile Fields
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1A2A3A))
                    .padding(20.dp)
            ) {
                Column {
                    // Avatar + Name + Student ID
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .background(TealPrimary, shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(30.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                profile?.name ?: "Loading...",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                "Student ID: ${profile?.studentId ?: "Loading..."}",
                                fontSize = 12.sp,
                                color = Color(0xFFB0BEC5)
                            )
                        }
                    }

                    // Thesis Progress Card (can make dynamic later)
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF2A3A4A)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Edit,
                                    contentDescription = null,
                                    tint = TealPrimary,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    "Thesis Progress",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TealPrimary
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Progress Bar
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .background(Color(0xFF3A4A5A), shape = RoundedCornerShape(3.dp))
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(0.45f) // replace with dynamic progress later
                                        .height(6.dp)
                                        .background(TealPrimary, shape = RoundedCornerShape(3.dp))
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                "45% Complete", // replace with dynamic progress later
                                fontSize = 12.sp,
                                color = Color(0xFFB0BEC5)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Profile fields from API
                    ProfileField("Full Name", profile?.name ?: "")
                    ProfileField("Email", profile?.email ?: "")
                    ProfileField("Student ID", profile?.studentId ?: "")
                    ProfileField("Faculty ID", profile?.facultyId ?: "")
                    ProfileField("Team Code", profile?.teamCode ?: "")
                    ProfileField("Department", profile?.department ?: "")
                    ProfileField("Account Status", profile?.accountStatus ?: "")

                }
            }
        }

        item { Spacer(modifier = Modifier.height(20.dp)) }

        // Tab Navigation
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TabButton("Home", selectedTab == "home") { onTabChange("home") }
                TabButton("Upcoming", selectedTab == "upcoming") { onTabChange("upcoming") }
                TabButton("Book", selectedTab == "book") { onTabChange("book") }
                TabButton("History", selectedTab == "history") { onTabChange("history") }
            }
        }

        item { Spacer(modifier = Modifier.height(20.dp)) }

        // Dashboard Stats
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    "Dashboard",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("Upcoming", "2", modifier = Modifier.weight(1f))
                    StatCard("Completed", "12", modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("This Month", "5", modifier = Modifier.weight(1f))
                    StatCard("Progress", "45%", modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
fun TabButton(label: String, isSelected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    if (isSelected) {
        Button(
            onClick = onClick,
            modifier = modifier.height(40.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = TealPrimary),
            contentPadding = PaddingValues(4.dp)
        ) {
            Text(label, fontSize = 12.sp, color = Color.White, maxLines = 2, textAlign = TextAlign.Center)
        }
    } else {
        OutlinedButton(
            onClick = onClick,
            modifier = modifier.height(40.dp),
            shape = RoundedCornerShape(8.dp),
            border = BorderStroke(1.dp, BorderGray),
            contentPadding = PaddingValues(4.dp)
        ) {
            Text(label, fontSize = 12.sp, color = Color.Black, maxLines = 2, textAlign = TextAlign.Center)
        }
    }
}

@Composable
fun StatCard(title: String, value: String, modifier: Modifier = Modifier) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                title,
                fontSize = 12.sp,
                color = TealPrimary,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                value,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
    }
}

@Composable
fun ProfileField(label: String, value: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Text(
            label,
            fontSize = 12.sp,
            color = GrayText,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            value,
            fontSize = 14.sp,
            color = Color.Black,
            fontWeight = FontWeight.Medium
        )
    }
}
