# MediConnect Frontend

React frontend for the MediConnect Healthcare Management Platform.

## Pages Included

- 🔐 Login & Register (with role selection)
- 📊 Dashboard (different view per role)
- 👤 Patient Management
- 👨‍⚕️ Doctor Directory
- 📅 Appointment Booking & Management
- 💊 Prescription Viewer
- 🔔 Notifications
- ⚙️ Admin Panel
- 👤 Profile Page

## Setup Instructions

### Prerequisites
- Node.js 18+ (download from nodejs.org)
- MediConnect backend running on localhost:8080

### Step 1 — Install Node.js
Go to nodejs.org and download the LTS version for Windows.

### Step 2 — Install dependencies
Open terminal in this folder and run:
```bash
npm install
```

### Step 3 — Start the frontend
```bash
npm run dev
```

### Step 4 — Open in browser
Go to: http://localhost:3000

## How it connects to the backend

The frontend talks to your Spring Boot API Gateway at:
```
http://localhost:8080
```

Make sure all 7 backend services are running first!

## Role-Based Views

| Role | Pages Available |
|---|---|
| PATIENT | Dashboard, Doctors, Appointments, Prescriptions, Notifications, Profile |
| DOCTOR | Dashboard, Patients, Appointments, Prescriptions, Notifications, Profile |
| ADMIN | Dashboard, Patients, Doctors, Appointments, Prescriptions, Notifications, Admin Panel, Profile |

## Build for Production
```bash
npm run build
```
Output goes to the `dist/` folder — ready to deploy on Vercel or Netlify for free!


## 🔗 Related Repository

*Backend:* https://github.com/Sanskar53/mediconnect

The backend is built with Java Spring Boot microservices architecture including:
- 7 independent microservices
- MongoDB databases
- JWT authentication
- Spring Cloud Eureka service discovery
- API Gateway routing
