# ThesisConsultationBooking-IT342-G01-Group1
IT342 System Integration Project – Thesis Consultation Booking System (IT Department)

A centralized platform designed for the College of Computer Studies – IT Department that streamlines the thesis consultation process. The system enables IT students to conveniently book consultations with their thesis advisers while allowing faculty and staff to manage schedules, approve or deny requests, and maintain proper consultation records. It eliminates informal arrangements through chats or walk-ins, reducing scheduling conflicts and ensuring transparency and organized documentation.

---

## 🧩 Tech Stack Used

- **Backend:** Spring Boot  
- **Frontend (Web):** React.js  
- **Mobile Application:** Android (Kotlin)  
- **Database:** PostgreSQL  
- **Other Tools & Libraries:** JWT Authentication, Axios, Retrofit, Render, Railway, Google OAuth

---

## ⚙️ Setup & Run Instructions

### 🔹 Backend (Spring Boot)
1. Clone the repository:
   ```bash
   git clone https://github.com/berna-ahito/ThesisConsultationBooking-IT342-G01-Group1.git


2.Navigate to the backend directory:
cd backend

3.Open the project in your IDE (e.g., IntelliJ or Eclipse).


4.Configure your PostgreSQL database in application.properties:

spring.datasource.url=jdbc:postgresql://<your-db-host>:5432/<your-db-name>
spring.datasource.username=<your-db-username>
spring.datasource.password=<your-db-password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

5.Run the backend server:

6.Navigate to the frontend directory:
cd frontend

7.Install dependencies:
npm install

8.Start the development server:
npm run dev

9.Open the android directory in Android Studio.

10.Update your API base URL in ApiClient.kt to point to your backend (e.g., Render deployment link or http://10.0.2.2:8080 for local testing).

11.Sync Gradle and build the project.

12.Run the app on an emulator or physical Android device.


👥 Team Members

Abadiano, Kent Dominic L. – Developer

Abella, Franchesca Louise R. – Developer

Agramon, Vicci Louise D. – Developer

Ahito, Bernadeth Claire G. – Developer
