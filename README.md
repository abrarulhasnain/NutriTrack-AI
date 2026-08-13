
# NutriTrack AI 🥗

A full-stack nutrition tracking web application with AI-powered meal logging, nutrition analytics, and personalized goal tracking. Built as a team project to help users log meals effortlessly and stay on top of their daily nutrition goals.

**Live App:** https://nutritrack-ai-frontend-production.up.railway.app

## Features

- **AI-Powered Meal Logging** — Describe what you ate in plain text, including Roman Urdu, Urdu, or household measures (e.g. "1 bowl daal, 2 rotis"). The AI identifies individual food items, converts household measures to grams, and adds descriptive qualifiers for ambiguous names (e.g. "rice" → "white rice"). If every item matches with high confidence, the meal is logged automatically — no manual entry needed.

- **Smart Food Matching** — Matches identified food names against a curated database of 300+ foods (USDA + South Asian/Pakistani dishes) as well as your own custom foods, using word-overlap and character-similarity matching tuned for short queries. Auto-logging only triggers when both the name and unit match with high confidence, so incorrect matches never get logged silently.

- **AI-Suggested Daily Goals** — During onboarding, your calorie and macro targets are automatically calculated from your age, height, weight, activity level, and fitness goal using the Mifflin-St Jeor formula — no manual math required, though you can always adjust them yourself.

- **AI Meal Suggestions** — The dashboard shows a personalized meal or snack suggestion generated from your remaining calories and macros for the day, helping you close out your targets without guesswork.

- **Dashboard & Analytics** — Daily calorie/macro rings, weekly trend charts, and the AI meal suggestion card, all in one view.

- **Water Tracking** — Log water intake and track daily hydration goals.

- **Custom Foods & Recipes** — Add your own foods and recipes, then log them directly as meals.

- **Reports** — View nutrition breakdowns and trends over any date range.

- **Secure Authentication** — Email/password and Google OAuth sign-in via Supabase, with email confirmation and password reset flows.

> **Note:** The AI is used strictly for identifying and interpreting food items — it never calculates nutrition values itself. All calorie/macro numbers come from the verified food database.

## Tech Stack

**Backend**
- FastAPI (Python)
- SQLAlchemy + PostgreSQL (via Supabase)
- Pydantic / pydantic-settings
- Groq API (AI meal identification)
- USDA FoodData Central API (food database seeding)

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Supabase JS client (auth)

**Infrastructure**
- Supabase (authentication + PostgreSQL hosting)
- Railway (backend + frontend deployment)

## Architecture

The backend follows a consistent layered structure for every module:

```
models → schemas → repository → service → router
```

- **models** — SQLAlchemy database models
- **schemas** — Pydantic request/response schemas
- **repository** — raw database queries
- **service** — business logic
- **router** — FastAPI route handlers

All database access goes through `Depends(get_db)`, and all API responses use standardized `success_response()` / `error_response()` helpers.

## Project Structure

```
NutriTrack-AI/
├── backend/
│   └── app/
│       ├── auth/          # Authentication & token verification
│       ├── users/         # User registration & profile linkage
│       ├── profiles/      # Profile setup & goal suggestions
│       ├── meals/         # Meal logging & history
│       ├── ai/            # AI-powered meal extraction
│       ├── nutrition/     # Food database & search
│       ├── custom_foods/  # User-created foods
│       ├── recipes/       # Recipe creation & meal logging
│       ├── water/         # Water intake tracking
│       ├── dashboard/     # Daily summary aggregation
│       └── reports/       # Date-range nutrition reports
└── frontend/
    └── src/
        ├── pages/          # Route-level page components
        ├── components/     # Shared UI components (Navbar, etc.)
        ├── api/            # Axios instance & Supabase client
        └── context/        # Auth context
```

## Module Ownership

| Module | Owner |
|---|---|
| Auth, AI meal logging, meal history, dashboard | Abrar |
| Profile setup, water tracking, recipes, custom foods, reports | Manahil |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Supabase project (for auth + PostgreSQL)
- A Groq API key (for AI meal parsing)

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Create a `.env` file (UTF-8, no BOM) in `backend/` with:

```
DATABASE_URL=postgresql+psycopg://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=...
GROQ_API_KEY=...
```

Run the server:

```bash
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Deployment

Both backend and frontend are deployed on Railway, with environment variables configured separately per service. The frontend build embeds `VITE_*` variables at build time, so any changes require a redeploy to take effect.

## License

This project is licensed under the MIT License.
```
