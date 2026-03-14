-# 🚀 PS-2: Web-Based Intelligent Interview Simulation Platform
## Hack & Forge 2026 — Full Blueprint (MERN Stack)

---

## 🧩 Core Feature List

### 🔐 1. Authentication & User Management
- User registration & login (JWT-based auth)
- Two roles: **Recruiter** (creates interview sessions) and **Candidate** (takes interview)
- Profile setup: name, target role, experience level, tech stack

---

### 📋 2. Job Role & Interview Configuration (Recruiter Side)
- Create an "Interview Session" with:
  - Job Title (e.g., Backend Engineer, Data Scientist)
  - Required Skills / Tech Stack tags
  - Experience Level (Junior / Mid / Senior)
  - Interview Rounds to simulate: Intro → Technical → Managerial
  - Time limit per session (e.g., 30 min)
- Generate a shareable **Interview Link** for candidates

---

### 🎙️ 3. AI Interview Engine (Core Feature)
- **Dynamic Question Generation** via LLM API (Gemini / OpenAI):
  - Intro round: Personal background, motivation, communication
  - Technical round: Role-specific, skill-tagged questions with progressive difficulty
  - Managerial round: Leadership, conflict resolution, situational questions
- **Adaptive Questioning**: Next question is selected based on:
  - Candidate's current score
  - Depth of previous answer
  - Role and skill tags
- **Follow-up questions** when answers are shallow or evasive
- **Context awareness**: AI remembers full conversation history within session

---

### 📝 4. Real-Time Response Evaluation Engine
Each candidate response is evaluated on:
| Dimension | What It Measures |
|---|---|
| **Technical Relevance** | Does it match the question's domain? |
| **Depth & Completeness** | Is it surface-level or detailed? |
| **Clarity & Communication** | Is it well-structured and readable? |
| **Accuracy** | Is the answer technically correct? |
| **Confidence Score** | Aggregated from all rounds |

- Each dimension scored **0–10**
- Real-time visual feedback after each answer (shown to recruiter, hidden from candidate during session)

---

### 📊 5. Live Recruiter Dashboard
- See candidate's ongoing session progress
- Watch answer history and running scores per dimension
- View AI-generated evaluation notes per answer
- Final suitability score with a **Hire / Hold / Reject** recommendation
- Export report as PDF

---

### 🖥️ 6. Candidate Interview Interface
- Clean, distraction-free chat-style interview UI
- Timer per question (configurable)
- Progress bar showing round (Intro → Technical → Managerial)
- Text-based answer input (with optional voice input via Web Speech API)
- Session summary shown after completion

---

### 📈 7. Post-Interview Analytics
- Individual candidate performance radar chart (per dimension)
- Round-wise score breakdown
- Comparison across multiple candidates for the same role
- AI-written summary paragraph per candidate

---

### 🔔 8. Notifications & Session Management
- Email/in-app notification when candidate completes interview
- Recruiter can view all sessions and their statuses
- Candidate gets a shareable result link after session

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Auth Pages │  │ Interview UI │  │ Recruiter Dashboard │ │
│  └────────────┘  └──────────────┘  └─────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + Socket.IO
┌────────────────────────▼────────────────────────────────────┐
│                      BACKEND (Node + Express)               │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐ │
│  │ Auth Service │  │ Session Service│  │  AI Service     │ │
│  │  (JWT)       │  │ (Interview mgmt│  │ (LLM API calls) │ │
│  └──────────────┘  └────────────────┘  └─────────────────┘ │
│  ┌──────────────┐  ┌────────────────┐                       │
│  │ Score Engine │  │ Socket Manager │                       │
│  │              │  │ (Real-time)    │                       │
│  └──────────────┘  └────────────────┘                       │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │         MongoDB             │
          │  Users | Sessions | Answers │
          │  Scores | Reports           │
          └─────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │   Gemini / OpenAI   │
              │      LLM API        │
              └─────────────────────┘
```

---

## 📁 Folder Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── session.controller.js
│   │   ├── interview.controller.js
│   │   └── score.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Session.model.js
│   │   ├── Answer.model.js
│   │   └── Report.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── session.routes.js
│   │   └── interview.routes.js
│   ├── services/
│   │   ├── ai.service.js          # LLM API wrapper (question gen + scoring)
│   │   └── score.service.js       # Scoring aggregation logic
│   ├── socket/
│   │   └── socket.js              # Socket.IO setup (real-time updates)
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ScoreRadarChart.jsx
│   │   │   ├── InterviewChat.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── TimerBar.jsx
│   │   │   └── RoundProgress.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── CreateSessionPage.jsx
│   │   │   ├── InterviewPage.jsx       # Candidate interview UI
│   │   │   ├── SessionReport.jsx
│   │   │   └── CandidateSummary.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── store/
│   │   │   └── useSessionStore.js    # Zustand store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Tech Stack Decisions

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Fast HMR, modern ecosystem |
| UI Library | ShadCN/UI + TailwindCSS | Beautiful, accessible components fast |
| State Management | Zustand | Lightweight, perfect for session state |
| Charts | Recharts | Radar chart for score visualization |
| Backend | Node.js + Express | MERN standard |
| Realtime | Socket.IO | Live score updates to recruiter |
| Auth | JWT + bcrypt | Secure, stateless |
| Database | MongoDB + Mongoose | Flexible schema for dynamic Q&A |
| AI | Google Gemini API (gemini-1.5-flash) | Free tier, fast, powerful |
| PDF Export | jsPDF | Client-side PDF generation |

---

## 🗂️ MongoDB Schema Design

### User
```js
{
  _id, name, email, passwordHash,
  role: "recruiter" | "candidate",
  createdAt
}
```

### Session
```js
{
  _id, recruiterId, jobTitle, skills[],
  experienceLevel, rounds[], timeLimit,
  status: "pending" | "ongoing" | "completed",
  shareableLink, candidateId, createdAt
}
```

### Answer
```js
{
  _id, sessionId, questionId, questionText,
  round: "intro" | "technical" | "managerial",
  answerText, scores: {
    technicalRelevance, depth,
    clarity, accuracy
  },
  aiEvaluation: String,   // AI explanation
  timestamp
}
```

### Report
```js
{
  _id, sessionId, candidateId,
  overallScore, roundScores: {},
  dimensionScores: {},
  aiSummary: String,
  recommendation: "hire" | "hold" | "reject",
  generatedAt
}
```

---

## 🤖 AI Service Design (Key Intelligence)

### Question Generation Prompt Template:
```
You are an expert enterprise interviewer.
Role: {jobTitle}
Experience Level: {level}
Skills Required: {skills}
Current Round: {round}
Interview History: {last 5 Q&A pairs}
Candidate Score So Far: {score}

Generate ONE interview question. 
- If candidate is scoring high, increase difficulty.
- If answer was shallow, ask a follow-up drill-down.
- Keep it concise and professional.
Return JSON: { "question": "...", "type": "technical|behavioral|situational" }
```

### Response Evaluation Prompt Template:
```
You are evaluating a candidate's interview response.
Question: {question}
Candidate Answer: {answer}
Job Role: {jobTitle}, Skills: {skills}

Score each dimension from 0-10:
- technicalRelevance: Does it address the domain?
- depth: Is it detailed or surface-level?
- clarity: Is it structured and clear?
- accuracy: Is it factually correct?

Also write a 2-sentence evaluation note.
Return JSON: { scores: {...}, evaluation: "..." }
```

---

## ⏱️ 20-Hour Implementation Timeline

| Time | Task |
|---|---|
| **0–1 hr** | Project setup: MERN scaffold, Vite, env config, MongoDB Atlas |
| **1–3 hr** | Auth system: Register, Login, JWT, protected routes |
| **3–5 hr** | Session creation (Recruiter): form, DB model, shareable link |
| **5–8 hr** | AI Service: Gemini API integration, question gen + scoring prompts |
| **8–12 hr** | Interview Page (Candidate): chat UI, round progression, timer |
| **12–15 hr** | Score Engine + real-time Socket.IO updates to recruiter |
| **15–17 hr** | Recruiter Dashboard: live view, radar chart, answer history |
| **17–18 hr** | Report Page: PDF export, AI summary, hire recommendation |
| **18–19 hr** | UI Polish: animations, dark mode, mobile responsiveness |
| **19–20 hr** | Demo prep, README, deployment to Vercel/Render |

---

---

# 🤖 READY-TO-USE CODING PROMPT

> Copy and paste this entire prompt to instruct the AI to build the project:

---

```
Build a full-stack MERN (MongoDB, Express, React + Vite, Node.js) web application 
called "InterviewIQ" — a Web-Based Intelligent Interview Simulation Platform for 
enterprise recruitment.

## PROJECT OVERVIEW
An AI-powered platform where recruiters create interview sessions for specific job roles, 
and candidates take structured, adaptive interviews simulated by an LLM. The system 
evaluates responses in real-time and generates a detailed hiring report.

---

## TECH STACK
- Frontend: React (Vite), TailwindCSS, ShadCN/UI, Zustand, Recharts, Socket.IO-client
- Backend: Node.js, Express, Socket.IO, Mongoose
- Database: MongoDB (use Mongoose ODM)
- AI: Google Gemini API (model: gemini-1.5-flash) via @google/generative-ai npm package
- Auth: JWT + bcryptjs
- PDF: jsPDF (client-side)
- HTTP Client: Axios

---

## FOLDER STRUCTURE
Create this exact folder structure:
project-root/
├── backend/
│   ├── config/db.js
│   ├── controllers/ (auth, session, interview, score)
│   ├── middleware/auth.middleware.js
│   ├── models/ (User, Session, Answer, Report)
│   ├── routes/ (auth, session, interview)
│   ├── services/ (ai.service.js, score.service.js)
│   ├── socket/socket.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar, ScoreRadarChart, InterviewChat, TimerBar, RoundProgress)
│   │   ├── pages/ (LoginPage, RegisterPage, RecruiterDashboard, CreateSessionPage, 
│   │   │           InterviewPage, SessionReport, CandidateSummary)
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useSocket.js
│   │   ├── lib/axios.js
│   │   ├── store/useSessionStore.js
│   │   ├── App.jsx
│   │   └── index.css

---

## BACKEND REQUIREMENTS

### server.js
- Express app with CORS, JSON middleware
- Connect to MongoDB
- Mount all routes under /api
- Integrate Socket.IO
- Listen on PORT from .env

### MongoDB Models

User model:
{ name, email, passwordHash, role: enum["recruiter","candidate"], createdAt }

Session model:
{ recruiterId (ref User), jobTitle, skills (array of strings), 
  experienceLevel (enum: junior/mid/senior), 
  rounds (array: ["intro","technical","managerial"]),
  timeLimit (number, minutes), 
  status (enum: pending/ongoing/completed),
  shareableToken (unique string for candidate link),
  candidateId (ref User, optional),
  createdAt }

Answer model:
{ sessionId (ref Session), questionText, round (intro/technical/managerial),
  answerText, 
  scores: { technicalRelevance, depth, clarity, accuracy } (all 0-10),
  aiEvaluation (string), 
  timestamp }

Report model:
{ sessionId, candidateId, overallScore (0-100), 
  roundScores: { intro, technical, managerial },
  dimensionScores: { technicalRelevance, depth, clarity, accuracy },
  aiSummary (string), 
  recommendation (enum: hire/hold/reject),
  generatedAt }

### Auth Routes (/api/auth)
POST /register - hash password with bcrypt, save user, return JWT
POST /login - verify credentials, return JWT
GET /me - return current user from JWT (protected)

### Session Routes (/api/sessions) [Recruiter only]
POST / - create session, generate unique shareableToken (nanoid)
GET / - get all recruiter's sessions
GET /:id - get single session with answers and report

### Interview Routes (/api/interview)
GET /join/:token - candidate joins session by token (sets candidateId, status=ongoing)
POST /answer - candidate submits an answer:
  1. Save answer to DB
  2. Call AI service to evaluate the answer → save scores + evaluation
  3. Emit real-time score update via Socket.IO to recruiter room
  4. Call AI service to generate next question
  5. Return: { nextQuestion, scores, evaluation, isComplete }
POST /complete/:sessionId - finalize session:
  1. Aggregate all answer scores
  2. Call AI to generate overall summary and recommendation
  3. Save Report to DB
  4. Return full report

### AI Service (services/ai.service.js)
Use @google/generative-ai with gemini-1.5-flash model.

Function generateQuestion(jobTitle, skills, level, round, history, avgScore):
  Sends prompt to Gemini asking for ONE interview question.
  Prompt enforces: if avgScore > 7, increase difficulty; if last answer was short, ask follow-up.
  Returns JSON: { question: string, type: string }

Function evaluateAnswer(question, answer, jobTitle, skills):
  Sends prompt to Gemini to evaluate the answer.
  Returns JSON: { scores: { technicalRelevance, depth, clarity, accuracy }, evaluation: string }

Function generateReport(sessionData, allAnswers):
  Sends full session context to Gemini.
  Returns JSON: { aiSummary: string, recommendation: "hire"|"hold"|"reject" }

All Gemini calls must use response_mime_type: "application/json" to get structured output.
Handle API errors gracefully with try/catch.

### Socket.IO (socket/socket.js)
- On connection, candidate joins room: "session-{sessionId}"
- Recruiter joins room: "recruiter-{sessionId}"
- Emit event "scoreUpdate" to recruiter room when candidate submits answer
  Payload: { questionText, answerText, scores, evaluation, running averages }

---

## FRONTEND REQUIREMENTS

### Design System
- Dark theme with primary color: #6C63FF (electric indigo)
- Background: #0F0F1A (deep dark navy)
- Card background: #1A1A2E
- Accent: #00D4FF (cyan)
- Text: #E2E8F0
- Font: Inter (Google Fonts)
- All cards should have glassmorphism effect: backdrop-filter: blur(10px), subtle border
- Smooth page transitions using framer-motion
- All interactive elements must have hover animations

### Pages

#### LoginPage & RegisterPage
- Centered glassmorphism card
- Role selection toggle (Recruiter / Candidate) on Register
- Animated gradient background
- JWT stored in localStorage, user in AuthContext

#### RecruiterDashboard (/dashboard)
- Header with user info and logout
- "Create New Interview" button
- Table of all sessions: Job Title | Skills | Status | Candidate | Actions
- Click session → SessionReport page
- Each row shows status badge (pending=yellow, ongoing=blue, completed=green)

#### CreateSessionPage (/create-session)
- Multi-step form (3 steps with animated transitions):
  Step 1: Job title, experience level
  Step 2: Skills multi-tag input (type and press Enter to add tags)
  Step 3: Select rounds to include, set time limit
- On submit: POST to backend, receive shareableToken
- Display shareable link: "Copy Interview Link" button
- Link format: /interview/{token}

#### InterviewPage (/interview/:token) [Candidate view]
- If not logged in → show quick "Enter your name" modal → auto-register as candidate
- Full-screen dark chat interface
- Top bar: Job title | Current Round pill | Timer countdown
- RoundProgress component: shows Intro → Technical → Managerial with active highlight
- Chat-style messages: AI question on left, candidate response on right
- Text area at bottom with "Submit Answer" button
- On submit: disable textarea, show typing indicator, then show next question
- After final question: show "Interview Complete" screen → redirect to CandidateSummary

#### CandidateSummary (/summary/:sessionId)
- Show candidate's overall score (large animated number)
- Radar chart with 4 dimensions
- Round-by-round score breakdown
- List of all questions and answers with per-answer score pills
- Message: "Your recruiter will review your results shortly"

#### SessionReport (/report/:sessionId) [Recruiter view]
- Candidate info header
- Large overall score with color coding (>70=green, 50-70=yellow, <50=red)
- Radar chart for dimension scores
- Hire/Hold/Reject recommendation badge (colored)
- AI Summary paragraph in a highlighted blockquote card
- Accordion of all Q&A pairs with scores
- "Download PDF Report" button using jsPDF
- Real-time section: if session is ongoing, show live score updates via Socket.IO

### State Management (Zustand - store/useSessionStore.js)
Store: sessionId, questions[], answers[], currentRound, scores{}, isComplete

### Axios Config (lib/axios.js)
- Base URL from env variable
- Request interceptor: attach JWT from localStorage to Authorization header

### Routing (App.jsx)
- React Router v6
- Protected routes for /dashboard, /create-session, /report/:id
- Public routes: /login, /register, /interview/:token, /summary/:id

---

## ENVIRONMENT VARIABLES

Backend .env:
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Frontend .env:
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001

---

## PACKAGE.JSON REQUIREMENTS

Backend packages:
express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken, 
socket.io, @google/generative-ai, nanoid, nodemon (dev)

Frontend packages:
react, react-dom, react-router-dom, axios, zustand, recharts,
socket.io-client, framer-motion, jspdf, lucide-react,
tailwindcss, @tailwindcss/forms, shadcn/ui components

---

## IMPORTANT IMPLEMENTATION NOTES
1. All Gemini API calls must properly parse JSON responses — wrap in try/catch and 
   fall back to default question if parsing fails.
2. Maintain full conversation history in session (last 10 Q&A pairs) and send to 
   Gemini for context-aware questioning.
3. The InterviewPage must work WITHOUT recruiter being present — fully async.
4. Use nanoid for generating unique shareableTokens for sessions.
5. The RecruiterDashboard must poll or use Socket.IO to show live status changes.
6. Implement proper loading states and error toasts on all API calls.
7. Mobile responsive design is required.
8. PDF report must include: candidate name, job title, overall score, 
   dimension scores table, recommendation, and AI summary.

Start by creating the backend server.js and all models, then implement the AI service, 
then controllers/routes, then the frontend pages in order:
LoginPage → RegisterPage → RecruiterDashboard → CreateSessionPage → 
InterviewPage → CandidateSummary → SessionReport
```
