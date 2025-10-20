# ThesisConsultationBooking-IT342-G01-Group1
IT342 System Integration Project – Thesis Consultation Booking System (IT Department)

A centralized platform designed for the College of Computer Studies – IT Department that streamlines the thesis consultation process. The system enables IT students to conveniently book consultations with their thesis advisers while allowing faculty and staff to manage schedules, approve or deny requests, and maintain proper consultation records. It eliminates informal arrangements through chats or walk-ins, reducing scheduling conflicts and ensuring transparency and organized documentation.

---

## 🧩 Tech Stack Used

- **Backend:** Spring Boot  
- **Frontend (Web):** React.js  
- **Mobile Application:** Android (Kotlin)  
- **Database:** PostgreSQL  
- **Other Tools & Libraries:** JWT Authentication, Retrofit, Render, Railway, Google OAuth

---

## ⚙️ Setup & Run Instructions

### 🔹 Backend (Spring Boot)
1. Clone repository
   ```bash
   git clone https://github.com/berna-ahito/ThesisConsultationBooking-IT342-G01-Group1.git
   cd ThesisConsultationBooking-IT342-G01-Group1
   ```

2. Backend (Spring Boot)
   - Open `backend` in your IDE.
   - Configure database and other environment variables in `src/main/resources/application.properties` or via environment variables:
     ```
     spring.datasource.url=jdbc:postgresql://<DB_HOST>:5432/<DB_NAME>
     spring.datasource.username=<DB_USER>
     spring.datasource.password=<DB_PASS>
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     ```
   - Build and run:
     ```bash
     # from project root or backend folder
     ./mvnw spring-boot:run      # Linux/macOS
     mvnw.cmd spring-boot:run    # Windows
     ```
   - For local Android emulator use `http://10.0.2.2:8080` as backend base URL.

3. Frontend (React)
   - Open `frontend`:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - The dev server typically runs at `http://localhost:3000` (or as printed by Vite).

4. Mobile (Android - Kotlin)
   - Open the `android` folder in Android Studio.
   - Update API base URL in `ApiClient.kt`.
   - Sync Gradle and run on an emulator or device.

---


## 👥 Team Members

Abadiano, Kent Dominic L. – Developer

Abella, Franchesca Louise R. – Developer

Agramon, Vicci Louise D. – Developer

Ahito, Bernadeth Claire G. – Developer
