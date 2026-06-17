
# 🚀 CodeBlaze

CodeBlaze is an AI-powered coding platform designed to help developers learn, practice, and build applications efficiently. The platform combines coding challenges, AI-assisted problem solving, code execution, and video learning into a single integrated environment.

![CodeBlaze Banner](https://img.shields.io/badge/MERN-Full%20Stack-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🌟 Features

### 👨‍💻 Coding Practice
- Solve coding problems across multiple difficulty levels.
- Track submissions and performance.
- View execution results and feedback.

### 🤖 AI Coding Assistant
- Ask coding-related questions.
- Get AI-generated explanations and guidance.
- Learn concepts interactively.

### ⚡ Online Code Execution
- Run code directly from the browser.
- Supports multiple programming languages.
- Instant compilation and execution feedback.

### 🎥 Video Learning Integration
- Access curated educational content.
- Learn concepts alongside practical problem solving.

### 🔐 Authentication & Authorization
- Secure JWT-based authentication.
- Role-based access control.
- Protected routes and user sessions.

### 📊 User Dashboard
- Profile management.
- Submission tracking.
- Personalized coding experience.

---

# 🏗️ System Architecture

```text
┌─────────────┐
│   Frontend  │
│ React + Vite│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Express API │
│  Node.js    │
└──────┬──────┘
       │
 ┌─────┴─────┐
 ▼           ▼
MongoDB    Redis
(Database) (Caching /
            Session &
            Token Blacklist)

       │
       ▼
 AI Services & Code Execution Engine
```

---

# ⚙️ Tech Stack

## Frontend

- React.js
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Monaco Editor

## Backend

- Node.js
- Express.js
- JWT Authentication
- Bcrypt
- Redis
- REST APIs

## Database

- MongoDB
- Mongoose ODM

## AI Integration

- Generative AI APIs
- Conversational Coding Assistant

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cache Layer: Redis Cloud

---

# 📂 Project Structure

```text
CodeBlaze
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── redux
│   └── services
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── services
│
└── README.md
```

---

# 🔄 Workflow

## 1. User Authentication

```text
User
  │
  ▼
Register / Login
  │
  ▼
JWT Generated
  │
  ▼
Stored in HTTP-only Cookie
  │
  ▼
Authenticated Requests
```

---

## 2. Problem Solving Flow

```text
Select Problem
      │
      ▼
Write Code
      │
      ▼
Submit Solution
      │
      ▼
Execute Code
      │
      ▼
Store Result
      │
      ▼
Display Feedback
```

---

## 3. AI Assistant Flow

```text
User Query
     │
     ▼
Backend API
     │
     ▼
AI Service
     │
     ▼
Generated Response
     │
     ▼
Frontend Display
```

---

# 🔐 Security Features

- JWT Authentication
- Password Hashing using Bcrypt
- HTTP-only Cookies
- CORS Protection
- Role-based Authorization
- Redis Token Blacklisting
- Secure Environment Variables

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/aryansharma-prog/CodeBlaze.git
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash
cd backend
npm install
npm start
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=4000

DB_CONNECT_STRING=

JWT_KEY=

REDIS_URL=

AI_API_KEY=
```

## Frontend

```env
VITE_BACKEND_URL=
```

---

# 📡 API Modules

### Authentication

```text
POST /user/register
POST /user/login
POST /user/logout
GET  /user/check
GET  /user/getProfile
DELETE /user/deleteProfile
```

### Problems

```text
POST   /problem/create
GET    /problem/all
GET    /problem/:id
PUT    /problem/:id
DELETE /problem/:id
```

### Submission

```text
POST /submission/create
GET  /submission/history
```

### AI Assistant

```text
POST /ai/chat
```

### Videos

```text
GET /video/all
POST /video/create
```

---

# 🎯 Future Enhancements

- Contest System
- Leaderboards
- Real-time Collaboration
- AI Code Review
- Interview Preparation Mode
- Company-wise Problem Sets
- Performance Analytics Dashboard

---

# 👨‍💻 Author

**Aryan Sharma**

- GitHub: https://github.com/aryansharma-prog
- Project: https://code-blaze-git-main-aryansharma-progs-projects.vercel.app

---

# ⭐ Support

If you find this project useful, consider giving it a star on GitHub.

It helps motivate further development and improvements.