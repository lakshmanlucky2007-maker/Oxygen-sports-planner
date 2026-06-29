# 🏏 Oxygen Sports - AI Player Age-based Equipment Growth Planner

An AI-powered full-stack web application designed for **Oxygen Sports**, a leading sports goods retailer in Hyderabad, India. The application helps parents and coaches plan a personalized **2-year equipment upgrade roadmap** for players aged 6–25 as they grow physically and advance in skill levels.

---

## 📋 Features

- **Quick Fill Template Presets:** Instantly load common player configurations (e.g., 8-year Beginner Cricketer, 12-year Football Forward) in a single click.
- **Dynamic Input Form:** Gather player details (Sport, Age, Height with cm/feet conversion, Current Level, Current Equipment description, Budget, Specific Goals, and Coach/Parent Name).
- **Physical Growth Milestones:** AI correlates recommendations with typical physical growth (e.g., 5-7cm height increase per year) and motor skill progress.
- **Interactive Roadmap Timeline:** Clean vertical timeline segmenting Year 1 and Year 2 recommendations, fit check indicators, purchase timings, and milestones.
- **Action Toolbar:**
  - **Copy Text:** Formats the entire upgrade plan into Markdown text and copies it.
  - **Download PDF:** Exporters construct a beautifully styled and branded multi-page document using `jsPDF`.
  - **Share Link:** Copies an archive link directly targeting the saved record.
  - **Regenerate:** Submits updated profile details to build a fresh recommendation.
- **Rating Feedback Widget:** Users submit star ratings, thumbs up/down, and textual comments directly tied to the generation record.
- **History Panel:** View, query search, sport-filter, and sort previously built plans, with responsive modal sheets.
- **Admin Analytics Dashboard:** PIN-protected analytics page rendering usage metrics, quality trend lines, sport breakdowns, age progress indicators, and system health status.

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide React + Recharts + jsPDF
- **Backend:** Node.js + Express.js
- **Database:** SQLite (default for local zero-config setup) or PostgreSQL (via `DATABASE_URL` env variable)
- **AI Engine:** OpenAI GPT-4o API (automatically falls back to a custom sports seeder system if no key is configured)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd oxygen-sports-planner/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template and configure values:
   ```bash
   cp .env.example .env
   ```
   *Note: If `OPENAI_API_KEY` is not set, the app will run in offline mode using a high-quality mock data generator.*
4. Launch the server:
   ```bash
   npm start
   ```
   The backend server runs on `http://localhost:5000/`. It automatically creates the SQLite database (`database.sqlite`) and seeds it with 25 historical generations if empty.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd oxygen-sports-planner/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   The frontend application is now active at `http://localhost:3000/`.

---

## 🔑 Admin Access
- Navigate to the **Admin Dashboard** tab.
- Enter the default PIN: **`1526`** to unlock the charts and metrics.
