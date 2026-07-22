# API Design Document

## Document Information

| Field | Value |
|-------|-------|
| Project | NutriTrack |
| Document | API Design Document |
| Version | 1.0 |
| Status | Draft |
| API Style | REST |
| Data Format | JSON |
| Authentication | JWT Bearer Token |

---

# Table of Contents

1. Introduction
2. API Standards
3. Request & Response Standards
4. Validation Rules
5. Authentication API
6. User API
7. Profile API
8. Meal API
9. Dashboard API
10. Water API
11. Recipe API
12. Custom Food API
13. Reports API
14. Common Error Codes
15. Rate Limiting
16. Pagination
17. Filtering & Sorting
18. API Versioning
19. Future APIs

---

# 1. Introduction

## 1.1 Purpose

This document defines the REST API contract for NutriTrack. It acts as the single source of truth for communication between the frontend and backend applications.

The document specifies:

- REST endpoints
- Authentication requirements
- Request and response schemas
- Validation rules
- Error handling
- HTTP status codes
- API versioning
- Security considerations

---

## 1.2 Scope

This document covers all REST APIs required for Version 1 of NutriTrack.

Included modules:

- Authentication
- Users
- User Profiles
- Meals
- Dashboard
- Water Tracking
- Recipes
- Custom Foods
- Reports

The following features are intentionally excluded from Version 1:

- Google OAuth
- Barcode Scanner
- Image Recognition
- Notifications
- Exercise Tracking
- Wearable Integrations

---

# 2. API Standards

## Base URL

```
/api/v1
```

Example:

```
/api/v1/auth/login
```

---

## API Style

- RESTful Architecture
- Resource-based endpoints
- Stateless communication
- JSON request and response bodies

---

## Content Type

Request:

```
application/json
```

Response:

```
application/json
```

---

## Authentication

Protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## HTTP Methods

| Method | Purpose |
|---------|----------|
| GET | Retrieve data |
| POST | Create resources |
| PUT | Replace resources |
| PATCH | Partial update |
| DELETE | Delete resources |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# 3. Request & Response Standards

## Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

---

## Date Format

All dates shall use ISO-8601.

Example:

```
2026-07-22
```

---

## Date-Time Format

```
2026-07-22T15:30:00Z
```

---

## UUID Format

All primary identifiers are UUID Version 4.

Example:

```
550e8400-e29b-41d4-a716-446655440000
```

---

# 4. Validation Rules

General validation rules applied throughout the API:

- Email must be unique.
- Email must follow RFC-compliant format.
- Password minimum length: 8 characters.
- Password must contain uppercase, lowercase, number, and special character.
- Nutrition values cannot be negative.
- Quantities must be greater than zero.
- Water intake must be greater than zero.
- Meal types are restricted to:
  - Breakfast
  - Lunch
  - Dinner
  - Snack
- UUIDs must be valid.
- JSON bodies must follow the documented schemas.

---

# 5. Authentication API

**Status:** To be completed

---

# 6. User API

**Status:** To be completed

---

# 7. Profile API

**Status:** To be completed

---

# 8. Meal API

**Status:** To be completed

---

# 9. Dashboard API

**Status:** To be completed

---

# 10. Water API

**Status:** To be completed

---

# 11. Recipe API

**Status:** To be completed

---

# 12. Custom Food API

**Status:** To be completed

---

# 13. Reports API

**Status:** To be completed

---

# 14. Common Error Codes

**Status:** To be completed

---

# 15. Rate Limiting

**Status:** To be completed

---

# 16. Pagination

**Status:** To be completed

---

# 17. Filtering & Sorting

**Status:** To be completed

---

# 18. API Versioning

**Status:** To be completed

---

# 19. Future APIs

Planned for future releases:

- Google OAuth
- Email Verification
- Password Reset
- Barcode Scanner
- Food Image Recognition
- Notifications
- Exercise Tracking
- Wearable Device Integration
- AI Meal Suggestions

# 5. Authentication API

## Overview

The Authentication API is responsible for user registration, authentication, authorization, and password management.

### Version 1 Features

- Register
- Login
- Logout
- Get Current User
- Change Password

### Future Features

- Google OAuth
- Email Verification
- Forgot Password
- Refresh Tokens
- Multi-Factor Authentication (MFA)

---

## Endpoint Template

Every endpoint in this document follows the same specification:

- Purpose
- Endpoint
- HTTP Method
- Authentication
- Request Headers
- Path Parameters
- Query Parameters
- Request Body
- Success Response
- Error Responses
- Validation Rules
- Business Rules

---

# 5.1 Register User

## Purpose

Creates a new user account.

### Endpoint

```
POST /api/v1/auth/register
```

### Authentication

Not Required

### Request Headers

```
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "confirm_password": "Password123!"
}
```

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Error Responses

| Status | Reason |
|---------|--------|
|400|Invalid request body|
|409|Email already exists|
|422|Validation failed|
|500|Internal server error|

### Validation Rules

- Email is required.
- Email must be valid.
- Email must be unique.
- Password minimum 8 characters.
- Password must contain:
  - Uppercase
  - Lowercase
  - Number
  - Special character
- Passwords must match.

### Business Rules

- Password is hashed using bcrypt before storage.
- New users receive the default role: **user**.
- User account is active immediately in Version 1.

---

# 5.2 Login

## Purpose

Authenticates the user and returns a JWT access token.

### Endpoint

```
POST /api/v1/auth/login
```

### Authentication

Not Required

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "access_token": "<JWT_TOKEN>",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### Error Responses

| Status | Reason |
|---------|--------|
|401|Invalid email or password|
|422|Validation failed|
|500|Internal server error|

### Validation Rules

- Email is required.
- Password is required.

### Business Rules

- Password is verified using bcrypt.
- JWT token contains:
  - user_id
  - email
  - role
- Token expiration is 1 hour.

---

# 5.3 Logout

## Purpose

Logs the user out.

### Endpoint

```
POST /api/v1/auth/logout
```

### Authentication

Required

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

None

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Business Rules

Version 1 uses stateless JWT authentication.

Logout is handled client-side by deleting the stored token.

Future versions may implement token blacklisting.

---

# 5.4 Get Current User

## Purpose

Returns information about the authenticated user.

### Endpoint

```
GET /api/v1/auth/me
```

### Authentication

Required

### Success Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "user",
    "is_active": true
  }
}
```

### Error Responses

| Status | Reason |
|---------|--------|
|401|Unauthorized|
|403|Forbidden|
|500|Internal server error|

---

# 5.5 Change Password

## Purpose

Allows an authenticated user to change their password.

### Endpoint

```
PUT /api/v1/auth/change-password
```

### Authentication

Required

### Request Body

```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

### Error Responses

| Status | Reason |
|---------|--------|
|400|Current password is incorrect|
|401|Unauthorized|
|422|Validation failed|
|500|Internal server error|

### Validation Rules

- Current password must match.
- New password must satisfy the password policy.
- New password must be different from the current password.

### Business Rules

- Password is re-hashed before storage.
- Existing JWT tokens remain valid until expiration in Version 1.

---

## Authentication Flow

```
Register
      │
      ▼
Database
      │
      ▼
Login
      │
      ▼
JWT Token
      │
      ▼
Protected APIs
      │
      ▼
Authorization Check
      │
      ▼
Business Logic
```

# 6. User API

## Overview

The User API manages account information related to authentication. It does **not** manage health or nutrition data. Those responsibilities belong to the Profile API.

---

## Endpoints

| Method | Endpoint | Description | Authentication |
|---------|----------|-------------|----------------|
| GET | /users/me | Get current user account | Required |
| PUT | /users/me | Update account information | Required |
| DELETE | /users/me | Delete user account | Required |

---

# 6.1 Get Current User

## Purpose

Returns account information for the authenticated user.

### Endpoint

```
GET /api/v1/users/me
```

### Authentication

Required

### Request Body

None

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2026-07-22T12:30:00Z"
  }
}
```

### Error Responses

- 401 Unauthorized
- 403 Forbidden
- 500 Internal Server Error

### Business Rules

- Users can access only their own account.
- Administrators may access administrative endpoints in future versions.

---

# 6.2 Update User

## Purpose

Updates account information.

### Endpoint

```
PUT /api/v1/users/me
```

### Authentication

Required

### Request Body

```json
{
  "email": "new@example.com"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Account updated successfully."
}
```

### Validation Rules

- Email must be valid.
- Email must be unique.

### Error Responses

- 400 Bad Request
- 409 Conflict
- 422 Validation Error

---

# 6.3 Delete User

## Purpose

Deletes the authenticated user's account.

### Endpoint

```
DELETE /api/v1/users/me
```

### Authentication

Required

### Success Response

```json
{
  "success": true,
  "message": "Account deleted successfully."
}
```

### Business Rules

- Version 1 performs a permanent delete.
- Future versions may implement soft deletes.

---

# 7. Profile API

## Overview

The Profile API manages health and nutrition information.

Profile data is stored separately from authentication data.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /profiles | Create profile |
| GET | /profiles/me | Get profile |
| PUT | /profiles/me | Update profile |
| POST | /profiles/calculate-goals | Calculate nutrition goals |

---

# 7.1 Create Profile

## Purpose

Creates the user's health profile.

### Endpoint

```
POST /api/v1/profiles
```

### Authentication

Required

### Request Body

```json
{
  "full_name": "Muhammad Abrar",
  "age": 21,
  "gender": "male",
  "height_cm": 178,
  "weight_kg": 72,
  "activity_level": "moderately_active",
  "fitness_goal": "muscle_gain"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Profile created successfully.",
  "data": {
    "calorie_goal": 2850,
    "protein_goal": 155,
    "carbs_goal": 350,
    "fat_goal": 75,
    "water_goal": 3200
  }
}
```

### Validation Rules

- Age must be greater than 0.
- Height must be greater than 50 cm.
- Weight must be greater than 20 kg.

### Business Rules

- One profile per user.
- Goals are automatically calculated after profile creation.

---

# 7.2 Get Profile

## Purpose

Returns the authenticated user's profile.

### Endpoint

```
GET /api/v1/profiles/me
```

### Authentication

Required

### Success Response

```json
{
  "success": true,
  "data": {
    "full_name": "Muhammad Abrar",
    "age": 21,
    "gender": "male",
    "height_cm": 178,
    "weight_kg": 72,
    "activity_level": "moderately_active",
    "fitness_goal": "muscle_gain",
    "calorie_goal": 2850,
    "protein_goal": 155,
    "carbs_goal": 350,
    "fat_goal": 75,
    "water_goal": 3200
  }
}
```

---

# 7.3 Update Profile

## Purpose

Updates health information.

### Endpoint

```
PUT /api/v1/profiles/me
```

### Authentication

Required

### Request Body

```json
{
  "height_cm": 180,
  "weight_kg": 75,
  "activity_level": "very_active",
  "fitness_goal": "fat_loss"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "calorie_goal": 2500,
    "protein_goal": 180,
    "carbs_goal": 250,
    "fat_goal": 70,
    "water_goal": 3500
  }
}
```

### Business Rules

- Updating profile automatically recalculates nutrition goals.

---

# 7.4 Calculate Goals

## Purpose

Recalculates nutrition goals without modifying profile information.

### Endpoint

```
POST /api/v1/profiles/calculate-goals
```

### Authentication

Required

### Request Body

None

### Success Response

```json
{
  "success": true,
  "data": {
    "calorie_goal": 2850,
    "protein_goal": 155,
    "carbs_goal": 350,
    "fat_goal": 75,
    "water_goal": 3200
  }
}
```

### Business Rules

- Uses the latest stored profile.
- Applies the application's nutrition formula.
- Does not call the AI service.

# 8. Meal API

## Overview

The Meal API manages meal logging, AI food extraction, nutrition calculation, meal history, meal updates, and meal deletion.

The AI service is responsible only for extracting structured food items from natural language.

The Nutrition Engine performs all nutrition calculations using the local PostgreSQL food database.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /meals | Create a meal |
| GET | /meals | Get meal history |
| GET | /meals/{meal_id} | Get meal details |
| PUT | /meals/{meal_id} | Update meal |
| DELETE | /meals/{meal_id} | Delete meal |

---

# 8.1 Create Meal

## Purpose

Creates a new meal from natural language input.

### Endpoint

```
POST /api/v1/meals
```

### Authentication

Required

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "meal_type": "Breakfast",
  "meal_date": "2026-07-22",
  "meal_text": "2 eggs, 3 slices of bread and one banana"
}
```

---

### Backend Workflow

1. Validate request.
2. Send meal text to AI Service.
3. AI extracts structured food items.
4. Nutrition Engine matches foods with local database.
5. Nutrition totals are calculated.
6. Meal is saved.
7. MealItems are saved.
8. Response returned.

---

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Meal created successfully.",
  "data": {
    "meal_id": "uuid",
    "total_calories": 610,
    "protein": 31,
    "carbs": 58,
    "fat": 20,
    "fiber": 7,
    "sugar": 15
  }
}
```

---

### Error Responses

| Status | Reason |
|---------|--------|
|400|Invalid request|
|401|Unauthorized|
|404|Food not found|
|422|Validation failed|
|500|AI processing failed|

---

### Validation Rules

- meal_type required
- meal_date required
- meal_text required
- meal_text maximum 1000 characters

---

### Business Rules

- AI extracts foods only.
- Nutrition Engine calculates nutrition.
- AI metadata stored in Meal table.
- Meal totals stored in Meal table.
- MealItems created automatically.

---

# 8.2 Get Meal History

## Purpose

Returns paginated meal history.

### Endpoint

```
GET /api/v1/meals
```

### Authentication

Required

---

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| page | Page number |
| page_size | Items per page |
| meal_type | Breakfast, Lunch, Dinner, Snack |
| start_date | Filter |
| end_date | Filter |

Example

```
GET /api/v1/meals?page=1&page_size=20&meal_type=Breakfast
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "meal_id": "uuid",
        "meal_type": "Breakfast",
        "meal_date": "2026-07-22",
        "calories": 610,
        "protein": 31
      }
    ],
    "total": 145,
    "page": 1,
    "page_size": 20
  }
}
```

---

# 8.3 Get Meal Details

## Purpose

Returns complete meal information.

### Endpoint

```
GET /api/v1/meals/{meal_id}
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "meal_id": "uuid",
    "meal_type": "Breakfast",
    "meal_date": "2026-07-22",
    "original_text": "2 eggs, bread and banana",
    "items": [
      {
        "food": "Egg",
        "quantity": 2,
        "unit": "piece",
        "calories": 156,
        "protein": 13
      },
      {
        "food": "Bread",
        "quantity": 3,
        "unit": "slice",
        "calories": 210
      }
    ],
    "totals": {
      "calories": 610,
      "protein": 31,
      "carbs": 58,
      "fat": 20,
      "fiber": 7,
      "sugar": 15
    }
  }
}
```

---

# 8.4 Update Meal

## Purpose

Updates an existing meal.

### Endpoint

```
PUT /api/v1/meals/{meal_id}
```

---

### Request Body

```json
{
  "meal_text": "3 eggs and 2 bananas"
}
```

---

### Backend Workflow

1. Replace meal text.
2. Call AI again.
3. Delete old MealItems.
4. Recalculate nutrition.
5. Create new MealItems.
6. Update totals.
7. Set

```
is_edited = true
edited_at = current_timestamp
```

---

### Success Response

```json
{
  "success": true,
  "message": "Meal updated successfully."
}
```

---

### Business Rules

Nutrition totals are always recalculated.

---

# 8.5 Delete Meal

## Purpose

Deletes a meal.

### Endpoint

```
DELETE /api/v1/meals/{meal_id}
```

---

### Success Response

```json
{
  "success": true,
  "message": "Meal deleted successfully."
}
```

---

### Business Rules

Deleting a meal automatically deletes all MealItems.

---

# AI Processing Flow

```
User
 │
 ▼
Frontend
 │
 ▼
POST /meals
 │
 ▼
AI Service
 │
 ▼
OpenAI-Compatible API
 │
 ▼
Structured Food List
 │
 ▼
Nutrition Engine
 │
 ▼
Food Database
 │
 ▼
Meal
 │
 ▼
MealItems
 │
 ▼
Response
```

---

# Nutrition Calculation Flow

```
Meal Text
     │
     ▼
AI Extraction
     │
     ▼
Structured Foods
     │
     ▼
Food Lookup
     │
     ▼
Nutrition Engine
     │
     ▼
Meal Totals
     │
     ▼
Database
```

---

## Notes

- AI never calculates nutrition.
- Nutrition Engine is the single source of truth.
- All totals are calculated server-side.
- Meal ownership is verified before every operation.
- Every endpoint requires authentication.

# 9. Dashboard API

## Overview

The Dashboard API provides a summary of the user's nutrition progress, daily goals, recent meals, and overall statistics.

The Dashboard API does **not** perform nutrition calculations. It retrieves calculated values from the database.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /dashboard/today | Today's dashboard |
| GET | /dashboard/summary | Dashboard summary |
| GET | /dashboard/weekly | Weekly nutrition |
| GET | /dashboard/monthly | Monthly nutrition |

---

# 9.1 Today's Dashboard

## Purpose

Returns today's nutrition progress.

### Endpoint

```
GET /api/v1/dashboard/today
```

### Authentication

Required

### Success Response

```json
{
  "success": true,
  "data": {
    "goals": {
      "calories": 2800,
      "protein": 160,
      "carbs": 330,
      "fat": 75,
      "water": 3500
    },
    "consumed": {
      "calories": 1980,
      "protein": 132,
      "carbs": 210,
      "fat": 52,
      "water": 2200
    },
    "remaining": {
      "calories": 820,
      "protein": 28,
      "carbs": 120,
      "fat": 23,
      "water": 1300
    }
  }
}
```

### Business Rules

- Goals come from UserProfile.
- Consumed values come from today's meals.
- Remaining values are calculated by the backend.

---

# 9.2 Dashboard Summary

## Purpose

Returns overall account statistics.

### Endpoint

```
GET /api/v1/dashboard/summary
```

### Success Response

```json
{
  "success": true,
  "data": {
    "total_meals": 415,
    "custom_foods": 24,
    "recipes": 12,
    "current_streak": 18,
    "water_logs": 210
  }
}
```

---

# 9.3 Weekly Dashboard

## Purpose

Returns nutrition totals for the previous seven days.

### Endpoint

```
GET /api/v1/dashboard/weekly
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-07-16",
      "calories": 2650,
      "protein": 152
    },
    {
      "date": "2026-07-17",
      "calories": 2810,
      "protein": 164
    }
  ]
}
```

---

# 9.4 Monthly Dashboard

## Purpose

Returns nutrition totals grouped by day for the selected month.

### Endpoint

```
GET /api/v1/dashboard/monthly
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| month | Month (1–12) |
| year | Year |

---

# Business Rules

- Data belongs only to the authenticated user.
- Results are sorted chronologically.
- Missing dates return zero values.

---

# 10. Water API

## Overview

The Water API manages daily water intake.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /water | Add water |
| GET | /water/today | Today's water |
| PUT | /water/{id} | Update entry |
| DELETE | /water/{id} | Delete entry |
| GET | /water/history | Water history |

---

# 10.1 Add Water

## Purpose

Adds a water intake record.

### Endpoint

```
POST /api/v1/water
```

### Authentication

Required

### Request Body

```json
{
  "amount_ml": 500
}
```

### Success Response

```json
{
  "success": true,
  "message": "Water intake added successfully."
}
```

### Validation Rules

- amount_ml > 0
- Maximum 5000 ml per entry

---

# 10.2 Today's Water

## Endpoint

```
GET /api/v1/water/today
```

### Success Response

```json
{
  "success": true,
  "data": {
    "goal": 3500,
    "consumed": 2100,
    "remaining": 1400
  }
}
```

---

# 10.3 Update Water Entry

### Endpoint

```
PUT /api/v1/water/{id}
```

### Request Body

```json
{
  "amount_ml": 750
}
```

### Success Response

```json
{
  "success": true,
  "message": "Water entry updated."
}
```

---

# 10.4 Delete Water Entry

### Endpoint

```
DELETE /api/v1/water/{id}
```

### Success Response

```json
{
  "success": true,
  "message": "Water entry deleted."
}
```

---

# 10.5 Water History

### Endpoint

```
GET /api/v1/water/history
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| start_date | Filter |
| end_date | Filter |
| page | Page number |
| page_size | Items per page |

### Success Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "date": "2026-07-22",
        "amount_ml": 500
      }
    ],
    "page": 1,
    "page_size": 20,
    "total": 45
  }
}
```

---

## Water Business Rules

- Users can access only their own water logs.
- Water totals contribute to dashboard calculations.
- Entries cannot have negative values.
- Deleting an entry immediately updates dashboard totals.

# 11. Recipe API

## Overview

The Recipe API allows users to create reusable recipes composed of multiple food items. Nutrition values are calculated automatically by the Nutrition Engine based on the ingredients.

Recipes can later be added to meals without re-entering individual ingredients.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /recipes | Create recipe |
| GET | /recipes | List recipes |
| GET | /recipes/{recipe_id} | Get recipe details |
| PUT | /recipes/{recipe_id} | Update recipe |
| DELETE | /recipes/{recipe_id} | Delete recipe |

---

# 11.1 Create Recipe

### Endpoint

```
POST /api/v1/recipes
```

### Authentication

Required

### Request Body

```json
{
  "name": "High Protein Breakfast",
  "ingredients": [
    {
      "food_id": "uuid",
      "quantity": 2,
      "unit": "piece"
    },
    {
      "food_id": "uuid",
      "quantity": 100,
      "unit": "gram"
    }
  ]
}
```

### Success Response

```json
{
  "success": true,
  "message": "Recipe created successfully.",
  "data": {
    "recipe_id": "uuid"
  }
}
```

### Business Rules

- Recipe names must be unique per user.
- Nutrition totals are calculated automatically.
- Users can access only their own recipes.

---

# 11.2 List Recipes

### Endpoint

```
GET /api/v1/recipes
```

Returns all recipes belonging to the authenticated user.

---

# 11.3 Get Recipe Details

### Endpoint

```
GET /api/v1/recipes/{recipe_id}
```

Returns the recipe, its ingredients, and calculated nutrition totals.

---

# 11.4 Update Recipe

### Endpoint

```
PUT /api/v1/recipes/{recipe_id}
```

Updating ingredients automatically recalculates nutrition totals.

---

# 11.5 Delete Recipe

### Endpoint

```
DELETE /api/v1/recipes/{recipe_id}
```

Deletes the recipe and all associated RecipeItems.

---

# 12. Custom Food API

## Overview

The Custom Food API allows users to create food items that are not present in the master nutrition database.

These foods are available only to the user who created them.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /custom-foods | Create custom food |
| GET | /custom-foods | List custom foods |
| GET | /custom-foods/{food_id} | Get custom food |
| PUT | /custom-foods/{food_id} | Update custom food |
| DELETE | /custom-foods/{food_id} | Delete custom food |

---

# 12.1 Create Custom Food

### Endpoint

```
POST /api/v1/custom-foods
```

### Request Body

```json
{
  "name": "Grandma's Chicken Curry",
  "serving_size": 100,
  "serving_unit": "gram",
  "calories": 190,
  "protein": 22,
  "carbs": 8,
  "fat": 7,
  "fiber": 1,
  "sugar": 2
}
```

### Success Response

```json
{
  "success": true,
  "message": "Custom food created successfully."
}
```

### Validation Rules

- Name is required.
- Serving size must be greater than zero.
- Nutrition values cannot be negative.

### Business Rules

- Custom foods are private.
- Custom foods can be used in meals and recipes.

---

# 12.2 List Custom Foods

### Endpoint

```
GET /api/v1/custom-foods
```

Returns all custom foods created by the authenticated user.

---

# 12.3 Get Custom Food

### Endpoint

```
GET /api/v1/custom-foods/{food_id}
```

Returns complete nutrition information.

---

# 12.4 Update Custom Food

### Endpoint

```
PUT /api/v1/custom-foods/{food_id}
```

Updates nutrition information.

---

# 12.5 Delete Custom Food

### Endpoint

```
DELETE /api/v1/custom-foods/{food_id}
```

Deletes the custom food.

---

# 13. Reports API

## Overview

The Reports API generates nutrition summaries and exports user data.

Version 1 supports PDF exports.

Future versions may support CSV and Excel exports.

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /reports/daily | Daily report |
| GET | /reports/weekly | Weekly report |
| GET | /reports/monthly | Monthly report |
| GET | /reports/export/pdf | Export PDF |

---

# 13.1 Daily Report

### Endpoint

```
GET /api/v1/reports/daily
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| date | Report date |

Returns daily nutrition totals.

---

# 13.2 Weekly Report

### Endpoint

```
GET /api/v1/reports/weekly
```

Returns the previous seven days of nutrition.

---

# 13.3 Monthly Report

### Endpoint

```
GET /api/v1/reports/monthly
```

Returns nutrition grouped by day for the selected month.

---

# 13.4 Export PDF

### Endpoint

```
GET /api/v1/reports/export/pdf
```

### Success Response

```
application/pdf
```

### Business Rules

- Generates a downloadable PDF.
- Includes nutrition charts.
- Includes daily and weekly summaries.
- Includes water intake statistics.
- Includes macronutrient breakdown.
- PDF is generated on demand.

---

# Report Business Rules

- Users can export only their own data.
- Reports are generated using the latest stored values.
- Nutrition calculations are never performed during report generation.
- Report generation is read-only and does not modify stored data.

# 14. Common Error Codes

## Overview

The API uses standardized HTTP status codes and consistent error responses.

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is already registered."
    }
  ]
}
```

---

## HTTP Status Codes

| Status | Meaning | Description |
|---------|---------|-------------|
| 200 | OK | Request completed successfully |
| 201 | Created | Resource created successfully |
| 204 | No Content | Resource deleted successfully |
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Validation Error | Input validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

---

## Common Application Errors

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid email or password |
| AUTH_002 | JWT token expired |
| AUTH_003 | Invalid JWT token |
| AUTH_004 | Account disabled |
| USER_001 | User not found |
| PROFILE_001 | Profile not found |
| PROFILE_002 | Profile already exists |
| MEAL_001 | Meal not found |
| MEAL_002 | AI processing failed |
| MEAL_003 | Food not recognized |
| FOOD_001 | Food not found |
| FOOD_002 | Duplicate custom food |
| WATER_001 | Invalid water amount |
| RECIPE_001 | Recipe not found |
| REPORT_001 | Report generation failed |

---

# 15. Rate Limiting

## Purpose

Rate limiting protects the API from abuse and accidental excessive requests.

### Default Limits

| Endpoint | Limit |
|----------|-------|
| Login | 10 requests/minute |
| Register | 5 requests/minute |
| AI Meal Processing | 30 requests/hour |
| Standard APIs | 120 requests/minute |
| Report Generation | 20 requests/hour |

### Rate Limit Response

```
429 Too Many Requests
```

```json
{
  "success": false,
  "message": "Rate limit exceeded."
}
```

---

# 16. Pagination

Endpoints returning collections use pagination.

## Query Parameters

| Parameter | Default |
|-----------|---------|
| page | 1 |
| page_size | 20 |

Maximum page size:

```
100
```

### Example

```
GET /api/v1/meals?page=2&page_size=20
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 2,
    "page_size": 20,
    "total": 145,
    "total_pages": 8
  }
}
```

---

# 17. Filtering & Sorting

Most list endpoints support filtering.

## Common Filters

| Parameter | Example |
|-----------|---------|
| start_date | 2026-07-01 |
| end_date | 2026-07-31 |
| meal_type | Breakfast |
| search | Chicken |

---

## Sorting

```
sort_by=meal_date
```

```
sort_order=asc
```

or

```
sort_order=desc
```

Example

```
GET /api/v1/meals?sort_by=meal_date&sort_order=desc
```

---

# 18. API Versioning

Current Version

```
/api/v1
```

Future breaking changes will be released under:

```
/api/v2
```

Versioning Rules

- Existing endpoints remain stable within a major version.
- Breaking changes require a new API version.
- Deprecated endpoints remain available for one major release before removal.

---

# 19. OpenAPI Documentation

The backend automatically generates interactive API documentation using FastAPI.

## Swagger UI

```
/docs
```

## ReDoc

```
/redoc
```

These interfaces allow developers to:

- Browse endpoints
- View schemas
- Test APIs
- Inspect request and response models

---

# 20. API Security Best Practices

The API follows industry-standard security practices.

### Authentication

- JWT Bearer Authentication
- bcrypt password hashing
- HTTPS in production

### Authorization

- Role-Based Access Control (RBAC)
- User resource ownership verification

### Input Validation

- Pydantic request validation
- SQLAlchemy ORM protection against SQL injection
- UUID validation
- Request size limits

### Logging

The system records:

- Authentication events
- AI processing metadata
- Failed login attempts
- Internal server errors

Sensitive data such as passwords and JWT tokens are never logged.

---

# 21. Future APIs

Planned future modules include:

- Google OAuth
- Password Reset
- Email Verification
- Barcode Scanner
- Food Image Recognition
- Meal Planner
- Exercise Tracking
- Supplement Tracking
- Notifications
- Wearable Device Integration
- AI Meal Suggestions
- AI Nutrition Coach
- Public API
- Admin Dashboard API

---

# 22. Endpoint Summary

| Module | Endpoints |
|---------|-----------:|
| Authentication | 5 |
| Users | 3 |
| Profiles | 4 |
| Meals | 5 |
| Dashboard | 4 |
| Water | 5 |
| Recipes | 5 |
| Custom Foods | 5 |
| Reports | 4 |

**Total Version 1 Endpoints:** **40**

---

# 23. Conclusion

The NutriTrack API is designed to provide a secure, scalable, and maintainable REST interface for both the Web and Desktop applications.

Key characteristics include:

- RESTful architecture
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Consistent request and response formats
- Centralized validation
- AI-assisted meal extraction
- Backend-owned nutrition calculations
- Automatic OpenAPI documentation
- Versioned API strategy
- Extensible design for future features

This document serves as the authoritative API contract for Version 1 of NutriTrack.