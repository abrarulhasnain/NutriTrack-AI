
# NutriTrack AI 🥗
A full-stack nutrition tracking platform with AI-powered meal logging. Users describe what they ate in plain text (even Roman Urdu), and AI identifies the food items, matches them against a nutrition database, and logs the meal automatically — while all calorie and macro calculations come from verified data, not the AI.

**Live App:** https://nutritrack-ai-frontend-production.up.railway.app

## 📸 Overview

| Feature | Capability |
|---|---|
| AI Meal Logging | Describe a meal in plain text (English, Urdu, or Roman Urdu) → AI identifies items → matched against food database → meal auto-logged |
| AI Goal Suggestions | Enter age, height, weight, activity level, and fitness goal → calorie/macro targets auto-calculated via Mifflin-St Jeor formula |
| AI Meal Suggestions | Dashboard suggests a meal or snack based on your remaining calories and macros for the day |
| Custom Foods & Recipes | Add your own foods and recipes, then log them directly as meals |
| Water Tracking | Log daily water intake and track hydration goals |
| Reports | View nutrition breakdowns and trends over any date range |

## 🪄 Tech Stack

**Backend**

| Tool | Purpose |
|---|---|
| FastAPI | REST API framework |
| SQLAlchemy | ORM for PostgreSQL |
| Supabase | PostgreSQL database + Auth |
| Groq API | AI-powered food identification |
| USDA FoodData Central | Reference food database seeding |
| Pydantic / pydantic-settings | Request validation & config |

**Frontend**

| Tool | Purpose |
|---|---|
| React + Vite | UI framework + dev server |
| TypeScript | Type safety |
| Tailwind CSS + shadcn/ui | Styling & components |
| Framer Motion | Animations |
| Axios | API client |
| Supabase JS | Authentication |

## 📁 Project Structure

```
NutriTrack-AI/
├── backend/
│   └── app/
│       ├── auth/            # Token verification, current-user dependency
│       ├── users/           # User registration & Supabase ID linkage
│       ├── profiles/        # Profile setup + AI goal suggestions
│       ├── meals/           # Meal logging & history
│       ├── ai/               # AI-powered meal extraction (Groq)
│       ├── nutrition/       # Food database & search
│       ├── custom_foods/    # User-created foods
│       ├── recipes/         # Recipe creation & meal logging
│       ├── water/           # Water intake tracking
│       ├── dashboard/       # Daily summary aggregation
│       └── reports/         # Date-range nutrition reports
│
└── frontend/
    └── src/
        ├── pages/           # Route-level page components
        ├── components/      # Shared UI components (Navbar, etc.)
        ├── api/             # Axios instance & Supabase client
        └── context/         # Auth context
```

## ⚙️ Prerequisites

- Python 3.11+ — [python.org](https://python.org)
- Node.js 18+ — [nodejs.org](https://nodejs.org)
- A Supabase project — [supabase.com](https://supabase.com) (free tier works)
- A Groq API key — [console.groq.com](https://console.groq.com)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd NutriTrack-AI
```

### 2. Backend Setup

**2a. Create and activate a virtual environment**
```bash
cd backend
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Linux / macOS)
source .venv/bin/activate
```

**2b. Install Python dependencies**
```bash
pip install -r requirements.txt
```

**2c. Configure environment variables**

Create a `.env` file inside `backend/` (UTF-8, no BOM):
```
DATABASE_URL=postgresql+psycopg://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-api-key
```

> ⚠️ All environment variables must be declared as fields in the `Settings` class in `app/core/config.py` — `os.getenv()` will return `None` even if the value exists in `.env` if it isn't declared there.

**2d. Run the backend server**
```bash
uvicorn app.main:app --reload
```
The API will be available at: `http://127.0.0.1:8000`
Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> 💡 Vite embeds `VITE_*` variables at **build time** — any change to `.env` requires a dev server restart (or rebuild in production) to take effect.

Run the dev server:
```bash
npm run dev
```
The app will be available at: `http://localhost:5173`

## 🗄️ Database Overview (Supabase)

| Table | Description |
|---|---|
| `users` | Links Supabase Auth accounts to app user records |
| `user_profiles` | Body metrics, activity level, calorie/macro goals |
| `foods` | Shared reference database (USDA + South Asian dishes) |
| `custom_foods` | User-created foods |
| `meals` | Logged meals and meal items |
| `recipes` | User-created recipes |
| `water_logs` | Daily water intake entries |

## 🔐 Authentication Flow

- Users sign up via email/password (with email confirmation) or Google OAuth, both through Supabase Auth
- On first sign-in, `/users/register` links the Supabase account to an internal `users` row
- All protected endpoints require an `Authorization: Bearer <token>` header, verified via `get_current_user`
- If a user signs in with a different method than they registered with (e.g. switching from email/password to Google) using the same email, the backend automatically re-links the existing account instead of creating a duplicate or failing

## 🧠 AI Features

NutriTrack AI uses AI strictly to **understand and identify food**, never to calculate nutrition — all calorie/macro numbers always come from the verified food database.

| Feature | How it works |
|---|---|
| **AI Meal Logging** | Parses free-text meal descriptions (including Roman Urdu / Urdu), extracts individual food items, converts household measures ("1 bowl", "2 rotis") into grams, and adds descriptive qualifiers for ambiguous names (e.g. "rice" → "white rice") |
| **Smart Food Matching** | Matches identified items against both the shared `foods` table and the user's own `custom_foods`, using word-overlap + character-similarity scoring tuned for short queries |
| **Auto Meal Creation** | A meal is only auto-logged when both the food name and unit are matched with high confidence — otherwise it's left for manual review, so nothing gets logged incorrectly |
| **AI Goal Suggestions** | Calculates suggested daily calorie and macro targets from age, gender, height, weight, activity level, and fitness goal using the Mifflin-St Jeor equation, pre-filling the onboarding goals step |
| **AI Meal Suggestions** | Generates a single meal or snack suggestion on the dashboard based on the user's remaining calories and macros for the current day |

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register/link a Supabase user |
| GET | `/users/me` | Get current user |
| POST | `/profiles/` | Create profile |
| POST | `/profiles/suggest-goals` | AI-calculated goal suggestions |
| POST | `/ai/extract` | AI meal identification + auto-logging |
| GET | `/ai/suggestion` | AI meal/snack suggestion |
| GET / POST | `/meals/` | List / log meals |
| GET | `/dashboard/` | Daily summary (calories, macros, water, meals) |
| GET | `/reports/` | Nutrition report over a date range |
| GET / POST | `/water/` | Log / view water intake |
| GET / POST | `/custom-foods/` | Manage custom foods |
| GET / POST | `/recipes/` | Manage recipes |

Full interactive documentation: `http://127.0.0.1:8000/docs`

## 🏗️ Building for Production

**Backend** — deploy to any ASGI-compatible host (Railway, Render, Fly.io):
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Frontend**
```bash
cd frontend
npm run build
# Output in dist/ — deploy to Railway, Vercel, Netlify, or any static host
```

## 🛠️ Troubleshooting

| Issue | Fix |
|---|---|
| `404` on a valid route after deploy | Check the deployed frontend's `VITE_API_BASE_URL` — Vite env vars are baked in at build time, so a missing/stale value requires a rebuild |
| `.env` values not loading | Ensure the file is saved as UTF-8 **without BOM** — a BOM prefix silently breaks the first variable |
| `User registered nahi hai` on a known account | The account's `supabase_user_id` is out of sync (e.g. switched login method) — re-registering via `/users/register` re-links it automatically |
| Frontend can't reach backend | Confirm `VITE_API_BASE_URL` in `.env` matches your running backend URL |

## 👥 Contributors

- **Abrar** — Auth, AI meal logging, meal history, dashboard
- **Manahil Waheed** — Profile setup, water tracking, recipes, custom foods, reports

## 📄 License

This project is licensed under the MIT License.
```
