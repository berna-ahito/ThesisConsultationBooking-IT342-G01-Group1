# ThesisConsultationBooking-IT342-G01-Group1

## IT342 System Integration Project – Thesis Consultation Booking System (IT Department)

A centralized platform designed for the College of Computer Studies – IT Department that streamlines the thesis consultation process. The system enables IT students to conveniently book consultations with their thesis advisers while allowing faculty and staff to manage schedules, approve or deny requests, and maintain proper consultation records. It eliminates informal arrangements through chats or walk-ins, reducing scheduling conflicts and ensuring transparency and organized documentation.

---

## 🧩 Tech Stack Used

- **Backend:** Spring Boot 3.2.0 (Java 21)
- **Frontend:** React.js 18 + Vite
- **Mobile Application:** Android (Kotlin)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Google OAuth 2.0 + JWT
- **Security:** Spring Security
- **ORM:** Hibernate/JPA

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Java 17 or higher** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

Verify installation:

```bash
java --version    # Should show 17.x.x or higher
mvn --version     # Should show 3.9.x
node --version    # Should show 18.x.x or higher
```

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/berna-ahito/ThesisConsultationBooking-IT342-G01-Group1.git
cd ThesisConsultationBooking-IT342-G01-Group1
```

### 2. Get Credentials from Team Lead

⚠️ **Important:** You need these credentials to run the project:

- Supabase database password
- Google OAuth Client ID
- Google OAuth Client Secret

---

## ⚙️ Backend Setup (Spring Boot)

### Step 1: Configure Application Properties

```bash
cd backend

# Copy template to create config file (Windows)
copy src\main\resources\application.properties.example src\main\resources\application.properties

# For Mac/Linux:
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

### Step 2: Fill in Credentials

Open `backend/src/main/resources/application.properties` and update:

```properties
# Line 8: Database password
spring.datasource.password=YOUR_DB_PASSWORD_HERE

# Line 18-19: Google OAuth credentials
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET_HERE
```

### Step 3: Run Backend

```bash
# Install dependencies and run
mvn clean install -DskipTests
mvn spring-boot:run
```

✅ **Success indicators:**

- `Started ThesisConsultationApplication in X seconds`
- `Tomcat started on port 8080`

🧪 **Test:** Open http://localhost:8080/api/auth/test

- Should display: `"Backend is working!"`

---

## 🎨 Frontend Setup (React + Vite)

### Step 1: Configure Environment Variables

```bash
cd web

# Copy template to create config file (Windows)
copy .env.example .env.local

# For Mac/Linux:
cp .env.example .env.local
```

### Step 2: Fill in Google Client ID

Open `web/.env.local` and update:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

### Step 3: Run Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

✅ **Success indicators:**

- `VITE v5.x.x ready in xxx ms`
- `Local: http://localhost:5173/`

🧪 **Test:** Open http://localhost:5173

- Should display the login page

---

## 🗄️ Database (Supabase)

### Access Dashboard

- **URL:** https://supabase.com/dashboard
- **Project:** `thesis-consultation-booking`
- **Region:** Singapore (ap-southeast-1)

### Get Invited

Ask **@berna-ahito** to invite you to the Supabase project via email.

### Database Schema

The system uses the following main tables:

- `users` - User accounts and roles
- `consultations` - Consultation bookings (coming soon)
- `schedules` - Faculty availability (coming soon)

---

## 🔐 Security Notes

### ⚠️ Files You Should NEVER Commit:

These files contain sensitive credentials and are excluded via `.gitignore`:

- `backend/src/main/resources/application.properties` (real credentials)
- `web/.env.local` (real credentials)
- `web/.env` (any environment file without .example)

### ✅ Files Safe to Commit:

These are templates without real credentials:

- `backend/src/main/resources/application.properties.example`
- `web/.env.example`

---

## 🧪 Testing the Full System

### Integration Test

**Terminal 1 - Start Backend:**

```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started ThesisConsultationApplication`

**Terminal 2 - Start Frontend:**

```bash
cd web
npm run dev
```

Wait for: `Local: http://localhost:5173/`

**Browser Test:**

1. Open http://localhost:5173
2. Click "Sign in with Google"
3. Sign in with your CIT email
4. Should redirect to role-based dashboard

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `Connection refused` or `Authentication failed`

**Solution:**

- Verify database password in `application.properties`
- Check internet connection (Supabase is cloud-based)
- Contact team lead for correct credentials

**Problem:** `Port 8080 already in use`

**Solution:**

```bash
# Windows: Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID  /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
```

### Frontend Issues

**Problem:** `Network Error` or `CORS error`

**Solution:**

- Ensure backend is running on port 8080
- Check `VITE_API_BASE_URL` in `.env.local`
- Clear browser cache and reload

**Problem:** Google Sign-In not working

**Solution:**

- Verify `VITE_GOOGLE_CLIENT_ID` in `.env.local`
- Ensure you're added as test user in Google Cloud Console
- Contact team lead to add you

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/google` | Login with Google OAuth |
| GET    | `/api/auth/user`   | Get current user info   |
| POST   | `/api/auth/logout` | Logout user             |
| GET    | `/api/auth/test`   | Health check endpoint   |

---

## 👥 Team Members

| Name                             | Role                                  | CIT-U Email                     | GitHub                                           |
| -------------------------------- | ------------------------------------- | ------------------------------- | ------------------------------------------------ |
| **Ahito, Bernadeth Claire G.**   | Project Leader & Lead Developer (Web) | bernadethclaire.ahito@cit.edu   | [@berna-ahito](https://github.com/berna-ahito)   |
| **Abadiano, Kent Dominic L.**    | Backend Developer (Web & Mobile)      | kentdominic.abadiano@cit.edu    | [@KapitanKent](https://github.com/KapitanKent)   |
| **Abella, Franchesca Louise R.** | Frontend Developer (Web & Mobile)     | franchescalouise.abella@cit.edu | [@chescaabella](https://github.com/chescaabella) |
| **Agramon, Vicci Louise D.**     | Backend Developer (Web & Mobile)      | viccilouise.agramon@cit.edu     | [@Xansxxx3](https://github.com/Xansxxx3)         |

---

## 📝 License

This project is developed as part of IT342 System Integration course at Cebu Institute of Technology - University.

---

## 🙏 Acknowledgments

- **IT Department Faculty** - For guidance and support
- **Supabase** - For database hosting
- **Google Cloud Platform** - For OAuth authentication
