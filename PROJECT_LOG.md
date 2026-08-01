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