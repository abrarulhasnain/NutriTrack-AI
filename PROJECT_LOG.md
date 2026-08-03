# Project Log

## 2026-07-21

### Repository Setup

* Created GitHub repository
* Initialized project structure
* Added `.gitignore`
* Added `README.md`
* Pushed initial commit

### Documentation Completed

#### 01_Project_Charter.md

* Defined project vision and mission
* Defined objectives
* Defined scope
* Identified stakeholders
* Defined risks
* Established success criteria

#### 02_SRS.md

* Completed Software Requirements Specification
* Documented functional requirements
* Documented non-functional requirements
* Created use cases
* Created user stories
* Defined acceptance criteria
* Documented future enhancements

#### 03_SDD.md

* Completed Software Design Document
* Designed layered architecture
* Defined system components
* Designed modules
* Created deployment architecture
* Added sequence diagrams
* Added class design
* Added security design
* Defined error handling strategy
* Documented design patterns
* Added technology justification

#### 04_Database_Design.md

* Completed database design
* Designed database architecture
* Defined tables
* Defined relationships
* Created constraints
* Defined indexes
* Documented naming conventions
* Created data dictionary
* Planned migration strategy
* Documented future database expansion

#### 05_API_Design.md

* Designed REST API architecture
* Defined authentication APIs
* Defined user APIs
* Defined profile APIs
* Defined meal APIs
* Defined dashboard APIs
* Defined water tracking APIs
* Defined recipe APIs
* Defined custom food APIs
* Defined report APIs
* Standardized request/response models
* Defined validation rules
* Documented HTTP status codes
* Defined error response format
* Added API versioning strategy
* Added pagination, filtering, and security guidelines

#### 06_UI_UX_Design.md

* Defined design philosophy
* Created design system
* Selected color palette
* Selected typography
* Defined spacing system
* Selected icon library
* Defined component library
* Created navigation structure
* Created information architecture
* Defined user flows
* Designed screen specifications
* Added wireframes
* Defined responsive behavior
* Added accessibility guidelines
* Defined loading states
* Defined empty states
* Defined error states
* Defined animations
* Added theme support
* Added future UI roadmap

### Architecture Decisions Finalized

* AI extracts structured food only
* Backend Nutrition Engine performs all nutrition calculations
* Local PostgreSQL nutrition database
* Layered Architecture
* Feature-Based Modular Architecture
* Repository Pattern
* Service Layer Pattern
* Dependency Injection
* DTO Pattern (Pydantic)
* JWT Authentication
* Google OAuth reserved for Version 2
* Recipes supported in Version 1
* Custom Foods supported in Version 1
* User and UserProfile stored separately
* Meal totals stored for performance
* RBAC prepared for future expansion

### Current Status

* Repository Setup ✅
* Project Charter ✅
* SRS ✅
* SDD ✅
* Database Design ✅
* API Design ✅
* UI/UX Design ✅

### Pending Documentation

* 07_AI_Integration.md
* 08_Testing_Strategy.md
* 09_Deployment.md
* 10_Project_Roadmap.md
* 11_Architecture_Decisions.md

### Development Status

No application code has been written yet.

The project is fully planned and documented.

### Next Session

Begin project implementation.

Recommended order:

1. Initialize FastAPI backend
2. Configure PostgreSQL and SQLAlchemy
3. Configure Alembic
4. Initialize React + Vite frontend
5. Configure Tailwind CSS
6. Install shadcn/ui
7. Implement authentication module
8. Build database models
9. Implement Nutrition Engine
10. Develop REST APIs
11. Build frontend screens
12. Integrate AI service
13. Testing
14. Deployment

## 2026-07-25

### Architecture Decision

Switched from fully custom authentication to a hybrid architecture.

Decision:

- Supabase Authentication
- Supabase PostgreSQL
- FastAPI for all business logic
- AI handled through OpenAI-compatible APIs

Reason:

Authentication is solved infrastructure. Engineering effort should focus on NutriTrack's differentiating features:

- AI meal parsing
- Nutrition Engine
- Analytics
- Reports
- Business logic

Status:

✅ Approved

## 2026-07-30

### Development Session 1 — Backend Foundation

#### Environment Setup
* Installed psycopg2-binary to resolve ModuleNotFoundError
* Fixed DATABASE_URL dialect from `postgresql://` to `postgresql+psycopg://` (psycopg v3)
* Fixed .env BOM character issue (UTF-8 without BOM)
* Verified Supabase PostgreSQL connection successful

#### Alembic Configuration
* Initialized Alembic (`alembic init alembic`)
* Configured `alembic/env.py` to read DATABASE_URL from .env
* Configured `alembic/env.py` to auto-import all models
* Fixed config.py to resolve .env path using pathlib

#### Database Models Created
* `app/users/models.py` — User model (id, supabase_user_id, email, role, is_active, timestamps)
* `app/profiles/models.py` — UserProfile model (health data, nutrition goals)
* `app/nutrition/models.py` — Food model (master nutrition database)
* `app/custom_foods/models.py` — CustomFood model
* `app/meals/models.py` — Meal model (with AI metadata columns)
* `app/meals/meal_items.py` — MealItem model
* `app/water/models.py` — WaterLog model
* `app/recipes/models.py` — Recipe and RecipeItem models

#### Migrations
* Migration 1: `create users table` ✅
* Migration 2: `update users table` (added supabase_user_id, role columns) ✅
* Migration 3: `add all tables` (all 8 remaining tables) ✅

#### Current Database State (Supabase)
* users ✅
* user_profiles ✅
* foods ✅
* meals ✅
* meal_items ✅
* water_logs ✅
* custom_foods ✅
* recipes ✅
* recipe_items ✅

### Current Status
* FastAPI app running ✅
* Supabase PostgreSQL connected ✅
* All 9 database tables created ✅

### Next Session
1. Build utils/responses.py (standard API response format)
2. Integrate Supabase Auth
3. Build Users module (router, service, repository, schemas)
4. Build Profiles module
5. Build Nutrition Engine
## 2026-07-31

### Development Session 2 — Users Module + Authentication

#### utils/responses.py
* `success_response()` and `error_response()` implemented ✅

#### Users Module (models → schemas → repository → service → router)
* `app/users/schemas.py` — UserCreate, UserResponse ✅
* `app/users/repository.py` — get_by_id, get_by_email, get_by_supabase_id, create, delete ✅
* `app/users/service.py` — create_user (with duplicate-email check), get_user_by_id, get_user_by_email ✅
* `app/users/router.py` — POST /users/register, GET /users/me ✅

#### Authentication Module
* `app/core/config.py` — added supabase_url, supabase_anon_key, supabase_jwt_secret fields ✅
* `app/core/security.py` — verify_supabase_token() implemented ✅
* `app/auth/dependencies.py`:
  * `get_current_user()` — verifies token + fetches user from local DB, raises 404 if not registered
  * `get_verified_supabase_id()` — verifies token only, used for /register flow ✅

#### Architecture Decision — JWT Verification Strategy
* Attempted local JWT verification using Legacy JWT Secret (HS256) — failed
* Root cause: Supabase project uses new asymmetric JWT Signing Keys (ES256), not compatible with legacy HS256 secret verification
* Decision: Switched to Supabase Admin API verification (`supabase.auth.get_user(token)`) instead of local JWT decode
* Reason: Simpler implementation, real-time revocation/ban detection, acceptable tradeoff (extra network call per request) for current project scale
* Status: ✅ Approved and implemented

#### main.py
* Registered users_router via `app.include_router()` ✅

#### End-to-End Testing
* Created test Supabase user (disabled email confirmation for testing convenience)
* Generated real access token via Supabase Python client (sign_up / sign_in_with_password)
* Tested POST /users/register via Swagger UI — 200 OK ✅
* User successfully created in Supabase `users` table

### Current Status
* Users module fully functional (register + me) ✅
* Auth verification working end-to-end ✅
* FastAPI + Supabase Auth + Supabase PostgreSQL fully connected ✅

### Next Session
1. Verify GET /users/me endpoint
2. Push users + auth module to GitHub (feature branch)
3. Begin Meals module (Abrar) — models already exist, build schemas → repository → service → router
4. Begin AI module (Abrar) — food extraction only, no nutrition calculation
5. Manahil to begin Profiles module using same layered pattern

## 2026-08-01

### Development Session 3 — Meals Module + Bug Fixes

#### Foods Table Seeding
* Created `app/database/seed_foods.py` — curated dataset of 95 common foods (South Asian + international: staples, proteins, daal, dairy, vegetables, fruits, nuts, prepared dishes, snacks, beverages)
* Seed script uses SQLAlchemy session, checks for existing data before inserting (idempotent)
* Successfully seeded 95 rows into `foods` table ✅

#### Meals Module (models → schemas → repository → service → router)
* `app/meals/schemas.py` — MealItemCreate, MealCreate, MealItemResponse, MealResponse ✅
* `app/meals/repository.py` — get_food_by_id, get_custom_food_by_id, create_meal, get_meal_by_id, get_meals_by_user, delete_meal ✅
* `app/meals/service.py` — create_meal() includes Nutrition Engine logic (scales food's per-serving nutrition values by requested quantity), get_meal, get_meals, delete_meal ✅
* `app/meals/router.py` — POST /meals/, GET /meals/, GET /meals/{meal_id}, DELETE /meals/{meal_id} ✅

#### Nutrition Engine (basic implementation)
* Scaling formula: `scale = requested_quantity / food.serving_size`, applied to calories/protein/carbs/fat/fiber/sugar
* Currently manual-entry based (user provides food_id + quantity); AI-based text parsing deferred to AI module

#### Architecture Decision — HTTP Status Codes
* Discovered error responses were always returning 200 OK regardless of actual error (FastAPI default behavior when returning plain dict)
* Fixed by wrapping error responses in `JSONResponse(status_code=X, content=error_response(...))`
* create_meal errors → 400 Bad Request (invalid/missing food references in request)
* get_meal / delete_meal errors → 404 Not Found (specific resource doesn't exist)
* get_meals (list endpoint) intentionally has no try/except — empty results are valid, not errors

#### Bug Fixes — Model Relationship Chain
* Root cause: `users/models.py` was missing reciprocal `relationship()` declarations for modules built by both

## 2026-08-02

### Development Session 4 — Recipes Module Review & Fix (Manahil's Branch)

#### Cross-Branch Testing Setup
* Learned to fetch, checkout, and switch between teammate branches via GitHub Desktop
* Learned about branch stashing when switching with uncommitted changes
* Confirmed: each branch is independent — model relationship fixes must be applied per-branch, not globally

#### Reviewed Manahil's `recipes` Module (branch: manahil/recipes)
Found and fixed the following issues:

**Critical bugs (would crash on import):**
* `repository.py` — `update_recipe()` had missing closing `):` in function signature (syntax error)
* `service.py` — `get_recipe()` had missing closing `):` in function signature (syntax error)

**Project convention violations:**
* Router was using `response_model=RecipeResponse` + `HTTPException` directly instead of `success_response()`/`error_response()` pattern used elsewhere in the project
* Fixed to match Meals module convention

**Missing functionality:**
* No Recipe Items (ingredients) CRUD existed — recipes had no way to attach food items
* Added Nutrition Engine logic to recipes/service.py (same scale = quantity/serving_size pattern as Meals)
* No PUT (update) or DELETE endpoints existed in router — added both
* `RecipeResponse` schema was missing `total_carbs` field — added

**Model relationship fix (same as Meals module, applied to this branch separately):**
* `users/models.py` on `manahil/recipes` branch was missing reciprocal relationships (`meals`, `custom_foods`, `profile`, `water_logs`, `recipes`)
* `database/init_db.py` on this branch was empty — populated with all model imports

#### End-to-End Testing (manahil/recipes branch)
* POST /recipes/ — 200 OK (tested nutrition calculation correctness: 250g quantity vs 250g serving_size = full serving = 400 calories, matched expected)
* DELETE /recipes/{id} — 200 OK (valid), 404 Not Found (already deleted) ✅
* PUT /recipes/{id} — 200 OK (servings update confirmed)
* GET /recipes/, GET /recipes/{id} — verified working

#### Important Learning — Unit/Quantity Design Limitation
* Discovered: Nutrition Engine (both Meals and Recipes) assumes `quantity` is in the same unit as the food's `serving_size` — it does NOT do unit conversion (e.g., "piece" vs "g")
* Example bug found during testing: sending quantity=2, unit="piece" for a food with serving_size=250g resulted in incorrect (tiny) calorie calculation, because the engine just divided 2/250
* This is a known, accepted limitation for now — documented for future improvement (potential unit-conversion layer)
* Both Abrar and Manahil should keep this in mind when testing/using quantity + unit fields

#### Commit
* Committed and pushed all recipes fixes to `manahil/recipes` branch
* Commit message: "fix: recipes module bugs + relationship fixes + full nutrition engine"

### Current Status
* Users module ✅ (abrar/users-auth-module branch)
* Auth module ✅ (abrar/users-auth-module branch)
* Meals module ✅ (abrar/users-auth-module branch)
* Recipes module ✅ (manahil/recipes branch — reviewed, fixed, and tested by Abrar)
* Custom Foods module ❌ (not started by Manahil yet)
* AI module ❌ (not started)
* Profiles module ❌ (model only, no schemas/repo/service/router)
* Water module ❌ (model only, no schemas/repo/service/router)

### Next Session
1. Switch back to abrar/users-auth-module branch (confirm own work still intact)
2. Communicate recipes fixes + learnings to Manahil (esp. quantity/unit limitation)
3. Begin AI module — food text extraction only (no nutrition calculation, per project rule)
4. Eventually: create Pull Requests to merge both abrar/users-auth-module and manahil/recipes into main
5. Manahil to start Custom Foods module next