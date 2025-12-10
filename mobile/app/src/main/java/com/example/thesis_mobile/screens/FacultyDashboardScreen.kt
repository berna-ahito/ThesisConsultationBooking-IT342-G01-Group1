package com.example.thesis_mobile.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.thesis_mobile.ui.theme.*

@Composable
fun FacultyDashboardScreen() {
    var selectedTab by remember { mutableStateOf("home") }

    when (selectedTab) {
        "schedule" -> FacultyScheduleScreen { selectedTab = it }
        "requests" -> FacultyRequestsScreen { selectedTab = it }
        "consultations" -> FacultyConsultationsScreen { selectedTab = it }
        else -> FacultyHomeContent(selectedTab) { selectedTab = it }
    }
}

@Composable
fun FacultyHomeContent(selectedTab: String, onTabChange: (String) -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F7FA))
    ) {
        // Header with faculty info
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1A2A3A))
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Avatar
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
                                "Dr. Sarah Martinez",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                "Faculty • Computer Science",
                                fontSize = 12.sp,
                                color = Color(0xFFB0BEC5)
                            )
                        }
                    }

                    // Stats Row
                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        FacultyStat("Today", "2", modifier = Modifier.weight(1f))
                        FacultyStat("Pending", "2", modifier = Modifier.weight(1f))
                        FacultyStat("Total", "4", modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }

        // Tab Navigation
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TabButton("Home", selectedTab == "home", modifier = Modifier.weight(1f)) { onTabChange("home") }
                    TabButton("Schedule", selectedTab == "schedule", modifier = Modifier.weight(1f)) { onTabChange("schedule") }
                    TabButton("Requests", selectedTab == "requests", modifier = Modifier.weight(1f)) { onTabChange("requests") }
                    TabButton("Consultations", selectedTab == "consultations", modifier = Modifier.weight(1f)) { onTabChange("consultations") }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }

        // Dashboard Content
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                Text(
                    "Dashboard",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // Stats Grid
                Row(
                    modifier = Modifier
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("Today", "2", modifier = Modifier.weight(1f))
                    StatCard("Completed", "24", modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("This Week", "8", modifier = Modifier.weight(1f))
                    StatCard("Students", "15", modifier = Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Profile Information Card
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Person,
                                    contentDescription = null,
                                    tint = TealPrimary,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    "Profile Information",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.Black
                                )
                            }
                            Button(
                                onClick = { },
                                modifier = Modifier
                                    .height(32.dp)
                                    .width(60.dp),
                                shape = RoundedCornerShape(6.dp),
                                colors = ButtonDefaults.buttonColors(TealPrimary),
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text("Edit", fontSize = 12.sp, color = Color.White)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        ProfileField("Full Name", "Dr. Sarah Martinez")
                        ProfileField("Email", "sarah.martinez@university.edu")
                        ProfileField("Department", "Computer Science")
                        ProfileField("Phone", "+1 234 567 8901")
                        ProfileField("Address", "123 University Street, City, Country")
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
fun FacultyStat(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF2A3A4A)),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                label,
                fontSize = 12.sp,
                color = Color(0xFFB0BEC5),
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}
