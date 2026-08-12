# NutriTrack AI

AI-powered nutrition tracking web application.

## Status
In Development — Core features complete, polish phase in progress.

## Features

### Authentication
- Email/password signup with email confirmation
- Google Sign-In (OAuth)
- Forgot/reset password flow
- 4-step onboarding wizard with AI-free calorie/macro goal calculation (Mifflin-St Jeor equation)

### Meal Tracking
- AI-powered meal logging via natural language (chat widget on Dashboard)
- Automatic food matching against a 314-item reference food database
- Manual confirmation flow for low-confidence AI matches
- Meal history with delete support

### Dashboard
- Daily calories/protein/carbs/fat/water progress (circular indicators)
- Weekly calorie and water trend charts
- AI-generated daily meal suggestions based on remaining goals
- Today's logged meals summary

### Other Modules
- Profile management (goals, body metrics, activity level)
- Water intake tracking
- Custom foods (user-defined food items)
- Recipes with ingredient search
- Nutrition reports with date-range analytics and charts

## Tech Stack

**Frontend:**
- React + Vite + TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- Framer Motion (animations)
- Recharts (charts)
- React Router
- Axios

**Backend:**
- FastAPI (Python)
- SQLAlchemy 2.0
- PostgreSQL (via Supabase)
- Pydantic settings

**Auth & Database:**
- Supabase (Authentication + managed PostgreSQL)

**AI:**
- Groq API (`llama-3.1-8b-instant`) — food identification and meal suggestions only. Nutrition values are never AI-generated; they come from the verified foods database.

**External Data:**
- USDA FoodData Central API (verified nutrition data for the reference food database)

## Architecture

NutriTrack follows a hybrid architecture:
- **Supabase** provides authentication and managed PostgreSQL.
- **FastAPI** implements all business logic, AI integration, and nutrition calculations.
- **React** provides the web user interface.

This allows the project to focus on its core value while using production-grade authentication infrastructure.

### Key Design Principle
AI only *identifies* food items from text — it never calculates nutrition. All nutrition math (scaling by quantity, totals per meal) is handled deterministically by the backend using verified food data.

## Project Structure

NutriTrack-AI/
├── backend/ # FastAPI application
│ └── app/
│ ├── users/ auth/ meals/ ai/ dashboard/
│ ├── profiles/ water/ recipes/ custom_foods/
│ ├── reports/ nutrition/ database/ core/ utils/
├── frontend/ # React + Vite application
│ └── src/
│ ├── api/ components/ context/
│ └── pages/ (auth/ dashboard/ meals/ onboarding/
│ profile/ water/ recipes/ customFoods/ reports/)
└── docs/ # Project documentation


## Local Setup

### Backend
```powershell
cd backend
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

### Environment Variables
Copy `.env.example` and fill in your own values:
- `backend/.env` — Database, Supabase, Groq, and USDA API keys
- `frontend/.env` — Supabase URL/anon key and backend API base URL

## Team

- **Abrar:** Auth, AI meal logging, meal history, Dashboard, shared frontend infrastructure
- **Manahil:** Profile, Water tracking, Recipes, Custom Foods, Reports
