# TaskFlow - Team Task Manager

A full-stack web app for managing projects, assigning tasks, and tracking progress with role-based access control.

## Live Demo
> Deployed on Railway: [Add URL after deployment]

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Spring Boot 3 + Spring Security + JWT
- **Database**: MySQL
- **Deployment**: Railway

## Features
- JWT Authentication (Signup / Login)
- Role-based access: Admin and Member
- Admin: create projects, create & assign tasks, delete anything
- Member: view and update status of assigned tasks only
- Dashboard with task stats (total, completed, in progress, overdue)
- Task filtering by status

## Project Structure
```
Task_Manager/
├── frontend/   → React app (Vite + Tailwind)
└── backend/    → Spring Boot REST API
```

## Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL running locally

### 1. Create the database
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS Task_Mananger;"
```

### 2. Start the backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/projects | All | List projects |
| POST | /api/projects | Admin | Create project |
| DELETE | /api/projects/{id} | Admin | Delete project |
| GET | /api/tasks | All | List tasks (scoped by role) |
| POST | /api/tasks | Admin | Create & assign task |
| PATCH | /api/tasks/{id}/status | Admin/Assignee | Update task status |
| DELETE | /api/tasks/{id} | Admin | Delete task |
| GET | /api/users | Admin | List all users |

## Deployment on Railway

### Environment Variables to set on Railway:
```
DATABASE_URL=jdbc:mysql://<host>/<db>
DB_USERNAME=<username>
DB_PASSWORD=<password>
JWT_SECRET=<your-secret>
PORT=8080
```

### Deploy command:
```bash
cd backend && mvn package -DskipTests
```

### Start command:
```bash
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar
```
