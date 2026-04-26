# Level 2 - Task 1: Job Board

A full-stack Job Board platform built with **React** (Vite), **Node.js/Express**, and **SQLite** as part of the CODSOFT Web Development Internship.

## 🌟 Features
- **Frontend**: Built with React and Vite for blazing fast performance.
- **Backend**: Express API with SQLite database.
- **Authentication System**: Role-based access with Employer and Candidate accounts.
- **Employer Dashboard**: Post new job listings, manage jobs, and view applicants.
- **Candidate Dashboard**: Browse jobs, view detailed descriptions, and submit applications.
- **Search System**: Search jobs by keywords or company names.
- **Premium UI**: Cyber-modern aesthetics with dark mode, glassmorphism UI, and animated background blobs using Vanilla CSS.

## 🚀 Quick Start / Run Commands

To run this full-stack project, you will need two terminal windows: one for the backend and one for the frontend.

### 1. Setup & Starting the Backend
Open your terminal and run the following:
```powershell
cd "Level 2 - Task 1-Job Board/backend"
npm install
node server.js
```
*The API will start on http://localhost:5000 and create the local `database.sqlite` file.*

### 2. Setup & Starting the Frontend
Open a **second** terminal window and run:
```powershell
cd "Level 2 - Task 1-Job Board/frontend"
npm install
npm run dev
```
*The React app will launch on http://localhost:5173.*

## 📖 How to Use
1. Visit the home page to see featured jobs.
2. Go to **Login / Sign Up** and register an account. Choose if you want to be a **Job Seeker** or **Employer**.
3. If Employer: Visit your dashboard to post a new job.
4. If Job Seeker: Go to "Browse Jobs", click on a job details page, and submit your cover letter and (mock) resume to apply.
5. Apply logic will simulate an email notification via the backend console logs.

---
*Created for CodSoft Level 2 - Task 1.*
