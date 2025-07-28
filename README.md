# Job Portal Application

This is a full-stack Job Portal project using:

- **Frontend**: Angular
- **Backend**: Spring Boot
- **Database**: MySQL
- **Resume Management**: MinIO

---

## 🚀 Running the Project

### 🧩 Frontend

## Commands

cd frontend,
npm install,
ng serve

Runs on http://localhost:4200

🔧 Backend

## Commands

cd backend,
./mvnw spring-boot:run

Runs on http://localhost:8080


🗃️ MySQL Setup

Database: job_portal

User: root

Password: yourpassword


📦 MinIO Setup

URL: http://localhost:9000

Access Key: minioadmin

Secret Key: minioadmin

Bucket: resumes


🛡️ Security

JWT-based authentication

Role-based authorization (User / Admin)


About Project
• Developed a full-stack job portal with role-based authentication.
• Implemented JWT for secure user/admin login and Bcrypt for password encryption
• Used MinIO for uploading and serving resume files securely
• User Features: Register, login, search/apply jobs ,view/update profile, download resume, change password
• Admin Features: Register company, manage jobs, view/delete users, view all jobs/companies/applications, update
application status
