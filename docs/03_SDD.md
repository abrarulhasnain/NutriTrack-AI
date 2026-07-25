# Software Design Document (SDD)

**Project:** NutriTrack

**Version:** 1.0 (MVP)

**Prepared By:** Muhammad Abrar

**Date:** 21 July 2026

---

# 1. Introduction

## 1.1 Purpose

This Software Design Document (SDD) describes the architecture, components, database design, APIs, and technical decisions for NutriTrack. It serves as the blueprint for implementing the system defined in the Software Requirements Specification (SRS).

---

## 1.2 Scope

This document defines the internal structure of NutriTrack, including system architecture, backend components, frontend components, database organization, communication between services, security considerations, and deployment strategy.

---

## 1.3 Intended Audience

This document is intended for:

- Software Developers
- Software Architects
- Testers
- Future Contributors
- Project Maintainers

---

## 1.4 References

- Project Charter
- Software Requirements Specification (SRS)
- FastAPI Documentation
- React Documentation
- PostgreSQL Documentation
- OpenAI API Documentation
- Supabase Documentation

# 2. Design Goals

The design of NutriTrack aims to achieve the following goals:

- Modular architecture
- High maintainability
- Scalability
- Security
- Simple deployment
- Separation of concerns
- Easy AI provider replacement
- Reusable backend services
- Clean REST API architecture
- Future mobile app support

# 3. System Architecture

## 3.1 Architectural Style

NutriTrack follows a Layered Architecture pattern. Each layer has a single responsibility and communicates only with the layer directly below it.

Architecture Flow:

User
↓
Frontend (React / Electron)
↓
Supabase Auth (authentication & JWT issuance)
↓
REST API (FastAPI) ← validates JWT on every protected request
↓
Service Layer
↓
Repository Layer
↓
PostgreSQL Database (hosted via Supabase)

The AI Service is accessed by the Service Layer to extract structured food information from natural language meal descriptions.

---

## 3.2 Architecture Diagram

```text
                    +----------------------+
                    |      React UI        |
                    +----------+-----------+
                               |
                          HTTPS / JSON
                               |
                    +----------▼-----------+
                    |    FastAPI Router    |
                    +----------+-----------+
                               |
                    +----------▼-----------+
                    |    Service Layer     |
                    +----+-----------+-----+
                         |           |
                         |           |
              +----------▼-+     +---▼----------------+
              | AI Service |     | Nutrition Service  |
              +------+-----+     +--------+-----------+
                     |                      |
                     ▼                      ▼
              OpenAI-compatible      Repository Layer
                AI Provider                |
                                           ▼
                                   PostgreSQL Database
```

NutriTrack/
│
├── frontend/
├── backend/
├── database/
├── docs/
├── prompts/
├── scripts/
├── tests/
└── assets/

backend/
│
├── app/
│   │
│   ├── core/                 # Config, security, constants
│   │
│   ├── auth/
│   │      └── dependencies.py    # JWT validation dependency (Supabase token verification)
│   │
│   ├── users/
│   │
│   ├── meals/
│   │
│   ├── nutrition/
│   │
│   ├── dashboard/
│   │
│   ├── water/
│   │
│   ├── reports/
│   │
│   ├── ai/
│   │
│   ├── database/
│   │
│   ├── utils/
│   │
│   └── main.py
│
├── requirements.txt
└── .env

frontend/
│
├── src/
│   │
│   ├── app/
│   ├── components/
│   ├── pages/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── meals/
│   │   ├── water/
│   │   ├── reports/
│   │   └── profile/
│   │
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── assets/
│
└── package.json


User
    │
    ▼
React Frontend
    │
    ├──────────────────────────────────┐
    ▼                                  ▼
Supabase Auth                  FastAPI Router (JWT validated)
(register / login / token)             │
                                       ▼
                               Service Layer
                                       │
                           ┌───────────┘
                           ▼              ▼
                       AI Service   Nutrition Engine
                           │              │
                           ▼              ▼
                       OpenAI API   Repository Layer
                                         │
                                         ▼
                                  PostgreSQL (Supabase)

# 4. Component Design

## 4.1 Overview

NutriTrack is divided into independent software components. Each component has a single responsibility and communicates with other components through well-defined interfaces. This modular design improves maintainability, scalability, testing, and future feature development.

The major components are:

1. Frontend
2. Backend API
3. Authentication Module
4. User Module
5. Profile Module
6. Meal Module
7. AI Module
8. Nutrition Engine
9. Dashboard Module
10. Water Tracking Module
11. Reports Module
12. Database Layer

---

# 4.2 Frontend Component

## Purpose

Provides the user interface for interacting with the system.

## Responsibilities

- Display application pages
- Validate user input
- Send requests to backend APIs
- Display nutrition statistics
- Render charts and reports
- Handle routing
- Manage client-side state

## Technologies

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Recharts

## Dependencies

- Backend REST API

---

# 4.3 Backend API Component

## Purpose

Acts as the central controller of the application.

## Responsibilities

- Receive HTTP requests
- Validate Supabase JWT on protected requests
- Validate requests
- Execute business logic
- Communicate with AI
- Query database
- Return JSON responses

## Technologies

- FastAPI
- Pydantic
- SQLAlchemy

## Dependencies

- PostgreSQL
- AI Module

---

# 4.4 Authentication Component
# 4.4 Authentication Component

## Purpose

Validate user identity on every protected API request.

## Implementation

Authentication is handled by Supabase Auth.

Supabase is responsible for:
- User registration
- Login
- Logout
- Email verification
- Password reset
- Session management
- Google OAuth (Version 2)

FastAPI receives a Supabase-issued JWT access token from the client on every protected request and validates it before executing business logic. FastAPI does not implement registration, login, or password management.

## Inputs

- Supabase JWT access token (from Authorization header)

## Outputs

- Authenticated user identity (supabase_user_id extracted from token)
- 401 Unauthorized if token is missing or invalid

## Purpose

Manage user identity and security.

## Responsibilities

- Register users
- Login users
- Password hashing
- JWT authentication
- Google OAuth (Version 2)

## Inputs

- Email
- Password

## Outputs

- JWT Access Token
- Refresh Token (Future)

---

# 4.5 User Component

## Purpose

Manage user accounts.

## Responsibilities

- Create user
- Update user
- Delete user
- Retrieve user information

---

# 4.6 User Profile Component

## Purpose

Store health-related information required for nutrition calculations.

## Responsibilities

- Height
- Weight
- Age
- Gender
- Activity Level
- Fitness Goal

The component automatically triggers nutrition goal recalculation whenever profile information changes.

---

# 4.7 Meal Component

## Purpose

Manage meal records.

## Responsibilities

- Create meal
- Edit meal
- Delete meal
- Retrieve meal history
- Categorize meals

The Meal Component never calculates nutrition directly.

Instead, it forwards food data to the Nutrition Engine.

---

# 4.8 AI Component

## Purpose

Convert natural language into structured food information.

## Responsibilities

- Receive meal description
- Generate AI prompt
- Call AI provider
- Validate AI response
- Return structured JSON

Example Output

{
    "foods":[
        {
            "name":"Egg",
            "quantity":2,
            "unit":"piece"
        }
    ]
}

The AI Component never performs nutrition calculations.

---

# 4.9 Nutrition Engine

## Purpose

Calculate nutritional values for extracted foods.

## Responsibilities

- Search nutrition database
- Match food names
- Calculate serving values
- Aggregate nutrition totals
- Return standardized nutrition object

Supported Nutrients

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Sugar

The Nutrition Engine is the only component responsible for nutrition calculations.

---

# 4.10 Dashboard Component

## Purpose

Present nutrition progress visually.

## Responsibilities

- Daily summary
- Progress bars
- Charts
- Remaining nutrition goals
- Water progress

---

# 4.11 Water Tracking Component

## Purpose

Track daily water consumption.

## Responsibilities

- Add intake
- Edit intake
- Delete intake
- Calculate remaining goal

---

# 4.12 Reports Component

## Purpose

Generate printable reports.

## Responsibilities

- Daily reports
- Weekly reports (Future)
- Monthly reports (Future)
- PDF export

---

# 4.13 Database Layer

## Purpose

Persist application data.

## Responsibilities

- Store users
- Store profiles
- Store meals
- Store meal items
- Store foods
- Store water logs
- Store custom foods
- Store recipes

The Database Layer is accessed only through Repository classes.

Direct database access from the frontend is strictly prohibited.

# 5. Module Design

## 5.1 Overview

The backend follows a **Feature-Based Modular Architecture**. Each feature is developed as an independent module containing its own router, service, repository, models, and schemas.

This architecture promotes:

- High cohesion
- Low coupling
- Easy maintenance
- Independent testing
- Scalability
- AI-friendly development

Each module communicates with other modules only through well-defined service interfaces.

---

# 5.2 Backend Directory Structure

backend/
│
├── app/
│   │
│   ├── core/
│   │
│   ├── ├── auth/                 
│   ├── users/
│   ├── profiles/
│   ├── meals/
│   ├── nutrition/
│   ├── water/
│   ├── dashboard/
│   ├── reports/
│   ├── recipes/
│   ├── custom_foods/
│   ├── ai/
│   ├── database/
│   ├── utils/
│   │
│   └── main.py
│
├── requirements.txt
└── .env

---

# 5.3 Standard Module Structure

Every module shall follow the same internal structure.

Example:

meals/
│
├── router.py
├── service.py
├── repository.py
├── models.py
├── schemas.py

---

## router.py

Responsibilities

- Define REST endpoints
- Validate HTTP requests
- Call service layer
- Return HTTP responses

The router contains no business logic.

---

## service.py

Responsibilities

- Execute business logic
- Coordinate repositories
- Call AI Service
- Call Nutrition Engine
- Handle validation
- Apply business rules

The service layer contains the application's core logic.

---

## repository.py

Responsibilities

- Read data
- Write data
- Update data
- Delete data

Repositories communicate directly with PostgreSQL through SQLAlchemy.

Business logic is never implemented here.

---

## models.py

Responsibilities

- Define database entities
- Define table relationships
- Configure indexes
- Configure constraints

---

## schemas.py

Responsibilities

- Request validation
- Response serialization
- API documentation
- Data transfer objects

Pydantic models are used for all schemas.

---

# 5.4 Core Module

Purpose

Provide shared infrastructure.

Contents

- Configuration
- Environment variables
- Security utilities
- JWT utilities
- Constants
- Logging

---

# 5.5 Authentication Module

Authentication is managed by Supabase Authentication.

Responsibilities of Supabase:

- User Registration
- User Login
- Email Verification
- Password Reset
- Session Management
- Future Google OAuth

FastAPI does not authenticate users directly.

Instead, every protected request includes a Supabase-issued JWT access token.

FastAPI validates the token before executing business logic.

---

# 5.6 User Module

Responsibilities

- Create users
- Retrieve users
- Update users
- Delete users

Dependencies

- Database

---

# 5.7 Profile Module

Responsibilities

- Store personal information
- Calculate nutrition goals
- Update health data

Dependencies

- User Module
- Nutrition Module

---

# 5.8 Meal Module

Responsibilities

- Create meals
- Edit meals
- Delete meals
- Retrieve meal history

Dependencies

- AI Module
- Nutrition Engine

The Meal Module never calculates nutrition directly.

---

# 5.9 AI Module

Responsibilities

- Generate prompts
- Send requests to AI
- Parse JSON responses
- Validate extracted foods

Dependencies

- OpenAI-compatible API

---

# 5.10 Nutrition Module

Responsibilities

- Food lookup
- Serving conversion
- Nutrition calculation
- Nutrition aggregation

Dependencies

- Food Database

This module owns all nutrition calculations.

---

# 5.11 Dashboard Module

Responsibilities

- Daily totals
- Remaining goals
- Statistics
- Charts

Dependencies

- Meals
- Nutrition
- Water

---

# 5.12 Water Module

Responsibilities

- Add water
- Delete water
- Daily progress

Dependencies

- User

---

# 5.13 Reports Module

Responsibilities

- PDF generation
- Daily reports
- Future weekly reports
- Future monthly reports

Dependencies

- Dashboard

---

# 5.14 Recipes Module

Responsibilities

- Create recipes
- Edit recipes
- Delete recipes
- Calculate recipe nutrition

Dependencies

- Nutrition

---

# 5.15 Custom Foods Module

Responsibilities

- Create custom foods
- Edit custom foods
- Delete custom foods
- Search custom foods

Dependencies

- Nutrition

---

# 5.16 Module Communication Rules

1. Frontend communicates only with REST APIs.

2. Routers communicate only with Services.

3. Services communicate with Repositories.

4. Repositories communicate with PostgreSQL.

5. AI communication occurs only through the AI Module.

6. Nutrition calculations occur only inside the Nutrition Module.

7. No module may directly access another module's database tables.

8. Shared functionality shall be placed inside the Core or Utils modules.

# 6. Database Design Overview

## 6.1 Design Philosophy

The NutriTrack database is designed using relational database principles and Third Normal Form (3NF). The design emphasizes:

- Data integrity
- Scalability
- Minimal redundancy
- Clear relationships
- Efficient querying
- Easy maintenance

The database uses PostgreSQL as the primary relational database management system.

---

# 6.2 Entity Relationship Overview

The system consists of the following core entities:

- User
- UserProfile
- Meal
- MealItem
- Food
- WaterLog
- CustomFood
- Recipe
- RecipeItem

Relationship Summary:

User
│
├── UserProfile (1 : 1)
├── Meal (1 : Many)
├── WaterLog (1 : Many)
├── CustomFood (1 : Many)
└── Recipe (1 : Many)

Meal
│
└── MealItem (1 : Many)

Recipe
│
└── RecipeItem (1 : Many)

Food
│
└── Referenced by MealItem and RecipeItem

---

# 6.3 Database Tables

## User

Purpose

Stores application-level user data and links to the Supabase Auth identity.

Columns

- id (UUID, Primary Key)
- supabase_user_id (UUID, Unique — references the Supabase Auth user)
- email (for display and lookup only; authoritative copy lives in Supabase Auth)
- role (user / admin)
- is_active
- created_at
- updated_at

Notes

Authentication credentials (password hash, session tokens) are managed exclusively by Supabase Auth and are never stored in this table. This table exists to link application data (meals, profiles, water logs, etc.) to the authenticated identity.

---

## UserProfile

Purpose

Stores personal health information.

Columns

- user_id (Primary Key, Foreign Key)
- full_name
- age
- gender
- height_cm
- weight_kg
- activity_level
- fitness_goal
- calorie_goal
- protein_goal
- carbs_goal
- fat_goal
- water_goal

---

## Meal

Purpose

Represents one meal logged by the user.

Columns

- id
- user_id
- meal_date
- meal_type
- original_text
- total_calories
- total_protein
- total_carbs
- total_fat
- total_fiber
- total_sugar
- created_at

Meal types:

- Breakfast
- Lunch
- Dinner
- Snack

---

## MealItem

Purpose

Represents a single food item inside a meal.

Columns

- id
- meal_id
- food_id (nullable)
- custom_food_id (nullable)
- quantity
- unit
- calories
- protein
- carbs
- fat
- fiber
- sugar

Exactly one of `food_id` or `custom_food_id` must be populated.

---

## Food

Purpose

Master nutrition database.

Columns

- id
- name
- serving_size
- serving_unit
- calories
- protein
- carbs
- fat
- fiber
- sugar

This table is read-only during normal application usage.

---

## WaterLog

Purpose

Track daily water intake.

Columns

- id
- user_id
- date
- amount_ml

---

## CustomFood

Purpose

Store foods created by users.

Columns

- id
- user_id
- name
- serving_size
- serving_unit
- calories
- protein
- carbs
- fat
- fiber
- sugar
- created_at

---

## Recipe

Purpose

Store reusable recipes.

Columns

- id
- user_id
- name
- description
- servings
- created_at

---

## RecipeItem

Purpose

Store ingredients belonging to recipes.

Columns

- id
- recipe_id
- food_id (nullable)
- custom_food_id (nullable)
- quantity
- unit

Exactly one of `food_id` or `custom_food_id` must be populated.

---

# 6.4 Relationships

User → UserProfile
One-to-One

User → Meal
One-to-Many

Meal → MealItem
One-to-Many

User → WaterLog
One-to-Many

User → Recipe
One-to-Many

Recipe → RecipeItem
One-to-Many

User → CustomFood
One-to-Many

Food → MealItem
One-to-Many

Food → RecipeItem
One-to-Many

CustomFood → MealItem
One-to-Many

CustomFood → RecipeItem
One-to-Many

---

# 6.5 Constraints

- Email must be unique.
- A UserProfile cannot exist without a User.
- Every Meal belongs to exactly one User.
- Every MealItem belongs to exactly one Meal.
- Every WaterLog belongs to exactly one User.
- Every Recipe belongs to exactly one User.
- Every RecipeItem belongs to exactly one Recipe.
- Food records cannot be modified by end users.
- CustomFood records are owned by a single user.
- Meal totals must equal the sum of their MealItems.

---

# 6.6 Indexing Strategy

Indexes shall be created for:

- User.email
- Meal.user_id
- Meal.meal_date
- MealItem.meal_id
- Food.name
- CustomFood.user_id
- Recipe.user_id
- WaterLog.user_id

Composite indexes may be added after performance testing if required.

---

# 6.7 Data Integrity Rules

- Foreign key constraints shall be enforced.
- Cascade deletion shall be carefully configured to avoid accidental data loss.
- Numeric nutrition values cannot be negative.
- Meal quantities must be greater than zero.
- Required fields shall never be null unless explicitly allowed.

User Input
      │
      ▼
AI Service
      │
      ▼
Extracted Foods
      │
      ▼
Nutrition Engine
      │
      ├── Calculate MealItems
      │
      ├── Calculate Meal Totals
      │
      ▼
PostgreSQL
      │
      ├── Meal
      └── MealItem

# 7. Class Design

## 7.1 Overview

NutriTrack follows an object-oriented design. Classes are grouped by feature and responsibility. Each class has a single responsibility and collaborates with other classes through clearly defined interfaces.

---

## 7.2 Domain Classes

### User

**Attributes**

- id
- supabase_user_id
- email
- role
- is_active
- created_at
- updated_at

**Responsibilities**

- Link application data to the Supabase Auth identity
- Account lifecycle (deletion, status)
- User ownership enforcement

---

### UserProfile

**Purpose**

Stores health and fitness information.

**Attributes**

- user_id
- full_name
- age
- gender
- height_cm
- weight_kg
- activity_level
- fitness_goal
- calorie_goal
- protein_goal
- carbs_goal
- fat_goal
- water_goal

**Responsibilities**

- Store user health data
- Trigger nutrition goal recalculation

---

### Meal

**Purpose**

Represents one meal logged by the user.

**Attributes**

- id
- user_id
- meal_date
- meal_type
- original_text
- total_calories
- total_protein
- total_carbs
- total_fat
- total_fiber
- total_sugar

**Responsibilities**

- Represent a meal
- Aggregate MealItems
- Store nutrition totals

---

### MealItem

**Purpose**

Represents a single food item within a meal.

**Attributes**

- id
- meal_id
- food_id
- custom_food_id
- quantity
- unit
- calories
- protein
- carbs
- fat
- fiber
- sugar

**Responsibilities**

- Store nutritional values for one food item

---

### Food

**Purpose**

Represents an item from the master nutrition database.

**Responsibilities**

- Provide standardized nutritional information

---

### CustomFood

**Purpose**

Represents user-defined foods.

**Responsibilities**

- Store custom nutrition information

---

### Recipe

**Purpose**

Represents a reusable collection of ingredients.

**Responsibilities**

- Group multiple food items
- Calculate recipe nutrition

---

### RecipeItem

**Purpose**

Represents a single ingredient in a recipe.

**Responsibilities**

- Link recipes to foods
- Store ingredient quantity

---

### WaterLog

**Purpose**

Represents a water intake entry.

**Responsibilities**

- Store water consumption
- Support daily tracking

---

## 7.3 Service Classes

### AuthenticationService (JWT Validation Only)

Responsibilities

- Extract and validate Supabase JWT from the Authorization header
- Parse supabase_user_id from the validated token
- Reject requests with missing or invalid tokens (401)

Note: Registration, login, and password management are handled by Supabase Auth, not by this service.
---

### UserService

Responsibilities

- Manage user accounts

---

### ProfileService

Responsibilities

- Manage health profile
- Recalculate nutrition goals

---

### MealService

Responsibilities

- Create meals
- Edit meals
- Delete meals
- Retrieve meal history

---

### AIService

Responsibilities

- Build prompts
- Call AI provider
- Validate AI response

---

### NutritionEngine

Responsibilities

- Match foods
- Calculate nutrition
- Aggregate totals
- Update Meal totals

---

### DashboardService

Responsibilities

- Daily summary
- Progress calculations
- Statistics

---

### WaterService

Responsibilities

- Manage water intake

---

### ReportService

Responsibilities

- Generate PDF reports

---

### RecipeService

Responsibilities

- Manage recipes

---

### CustomFoodService

Responsibilities

- Manage custom foods

---

## 7.4 Repository Classes

Each feature module owns its repository.

Repositories are responsible only for data persistence.

Examples:

- UserRepository
- MealRepository
- FoodRepository
- WaterRepository
- RecipeRepository
- CustomFoodRepository

Repositories never contain business logic.

# 8. Sequence Diagrams

## 8.1 Meal Logging Flow

User
    ↓
Frontend
    ↓
FastAPI Router
    ↓
Meal Service
    ↓
AI Service
    ↓
OpenAI API
    ↓
Structured Food List
    ↓
Nutrition Engine
    ↓
Food Repository
    ↓
PostgreSQL
    ↓
Meal Repository
    ↓
PostgreSQL
    ↓
Frontend
    ↓
Dashboard Updated

---

## 8.2 User Login Flow

## 8.2 User Login Flow

User
    ↓
Frontend
    ↓
Supabase Auth (email + password submitted directly)
    ↓
JWT Access Token issued by Supabase
    ↓
Frontend stores token
    ↓
All subsequent API requests include: Authorization: Bearer <JWT>
    ↓
FastAPI validates JWT (no database call required)
    ↓
supabase_user_id extracted → business logic executes

---

## 8.3 Dashboard Flow

User
    ↓
Frontend
    ↓
Dashboard Router
    ↓
Dashboard Service
    ↓
Meal Repository
    ↓
Water Repository
    ↓
Nutrition Engine
    ↓
Dashboard Response
    ↓
Frontend

# 9. Deployment Architecture
## External Services

- OpenAI-compatible API
- Supabase (Authentication + PostgreSQL hosting)


## Development Environment

- Frontend: React + Vite
- Backend: FastAPI
- Database: PostgreSQL
- Desktop: Electron

## Production Environment

Client
↓
React/Electron
↓
HTTPS
↓
FastAPI Server
↓
PostgreSQL

External Service

OpenAI-compatible API


## Environment Variables

- DATABASE_URL
- OPENAI_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY     # Used by FastAPI to verify JWTs server-side
- SUPABASE_JWT_SECRET           # Supabase project JWT secret for token validation

## Deployment Goals

- Docker support
- CI/CD ready
- HTTPS enabled
- Environment-based configuration

# 10. Security Design

### Authorization

After authentication, the backend authorizes users based on their assigned role.

Version 1 supports:

- user
- admin

Role checks are performed at the service layer before executing privileged operations.
- Email and password authentication via Supabase Auth
- JWT Bearer token validation by FastAPI on every protected endpoint
- Google OAuth (Future) via Supabase Auth

## Authorization

- Users can access only their own data.
- Every protected endpoint requires authentication.

## Password Security

- Passwords are managed exclusively by Supabase Auth.
- The application backend has no access to user passwords at any point.
- Plain-text passwords are never transmitted to or stored by FastAPI.

## API Security

- HTTPS for all communication.
- Input validation with Pydantic.
- SQL injection prevention through SQLAlchemy ORM.

## Data Protection

- Sensitive configuration stored in environment variables.
- API keys never exposed to the frontend.

# 11. Error Handling

The application uses centralized exception handling.

Common Errors

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

Logging

- API errors
- Database errors
- AI service failures
- Unexpected exceptions

Users receive friendly error messages without exposing internal implementation details.

# 12. Design Patterns

NutriTrack adopts several software design patterns to improve maintainability, scalability, testability, and code organization.

---

## 12.1 Layered Architecture

### Purpose

Separates the application into logical layers so that each layer has a single responsibility.

### Structure

```
Frontend
      │
      ▼
API Router
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
Database
```

### Benefits

- Separation of concerns
- Easier maintenance
- Easier testing
- Better scalability

---

## 12.2 Repository Pattern

### Purpose

Abstract database operations from business logic.

### Structure

```
MealService
      │
      ▼
MealRepository
      │
      ▼
PostgreSQL
```

### Responsibilities

Repository:

- Create
- Read
- Update
- Delete

The repository never contains business logic.

### Benefits

- Database independence
- Easier unit testing
- Cleaner code

---

## 12.3 Service Layer Pattern

### Purpose

Centralize business logic.

### Structure

```
Router
   │
   ▼
MealService
   │
   ▼
Repository
```

### Responsibilities

- Validate requests
- Apply business rules
- Coordinate multiple repositories
- Call AI services
- Call Nutrition Engine

### Benefits

- Keeps routers simple
- Keeps repositories focused on persistence
- Improves maintainability

---

## 12.4 Dependency Injection

### Purpose

Provide dependencies to components instead of creating them manually.

### Example

```
Router
   │
   ▼
MealService
   │
   ▼
MealRepository
```

FastAPI's dependency injection system will be used throughout the backend.

### Benefits

- Loose coupling
- Easier testing
- Better modularity

---

## 12.5 Data Transfer Object (DTO)

### Purpose

Transfer validated data between the client and server.

### Implementation

Pydantic schemas will serve as DTOs.

Example

```
Frontend

MealCreateRequest

FastAPI

MealCreateSchema

MealService
```

### Benefits

- Automatic validation
- Type safety
- API documentation
- Prevents invalid input

---

## 12.6 Singleton Pattern

### Purpose

Ensure that shared resources are initialized only once.

### Usage

- Application configuration
- Database connection manager
- Environment settings

### Benefits

- Consistent configuration
- Reduced resource usage

---

## 12.7 Factory Pattern (Future)

### Purpose

Allow switching between different AI providers without changing business logic.

### Example

```
AIService
      │
      ▼
AI Factory
      │
 ┌────┴────┐
 ▼         ▼
OpenAI   Gemini
```

### Benefits

- Easy provider replacement
- Extensible architecture
- Reduced code duplication

---

## Summary

| Pattern | Purpose |
|---------|---------|
| Layered Architecture | Separate application into logical layers |
| Repository Pattern | Abstract database access |
| Service Layer Pattern | Centralize business logic |
| Dependency Injection | Reduce coupling and improve testing |
| DTO (Pydantic) | Validate and transfer API data |
| Singleton | Shared configuration and resources |
| Factory (Future) | Support multiple AI providers |

# 13. Technology Justification

## React

Chosen for modern component-based frontend development.

## FastAPI

Provides high performance, automatic API documentation, and strong typing.

## PostgreSQL

Reliable relational database with excellent performance and scalability.

## SQLAlchemy

Powerful ORM with strong PostgreSQL support.

## Tailwind CSS

Rapid UI development with consistent styling.

## Electron

Enables desktop application development using web technologies.

## OpenAI-Compatible API

Provides natural language understanding for meal parsing while allowing flexibility to switch providers.

## Recharts

Simple and responsive charting library for dashboards.

# 14. System Diagrams

This section provides visual representations of NutriTrack's architecture, component interactions, data model, and deployment. These diagrams complement the textual design specifications and serve as implementation references.

## Supabase

Provides production-grade authentication (registration, login, session management, JWT issuance) and PostgreSQL hosting. Eliminates the need to build and maintain custom authentication, allowing development effort to focus on AI and business logic.

---

## 14.1 High-Level Architecture Diagram

```text
                                    React / Electron
                        │
                        ▼
              Supabase Authentication
                        │
                 JWT Access Token
                        │
                        ▼
                 FastAPI Backend
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
 AI Service      Nutrition Engine   Business Services
      │                 │                 │
      └─────────────────┼─────────────────┘
                        ▼
                Repository Layer
                        │
                        ▼
            PostgreSQL (Supabase)
```

---

## 14.2 Component Diagram

```text
+-------------------------------------------------------------+
|                         Frontend                            |
|-------------------------------------------------------------|
| Login | Dashboard | Meals | Water | Reports | Settings      |
+------------------------------+------------------------------+
                               |
                               ▼
+-------------------------------------------------------------+
|                       FastAPI Backend                       |
|-------------------------------------------------------------|
| JWT Validation | Users | Profiles | Meals | Nutrition | Dashboard |
| Water | Reports | Recipes | Custom Foods | AI                    |
+------------------------------+------------------------------+
                               |
                               ▼
+-------------------------------------------------------------+
|                       PostgreSQL Database                   |
+-------------------------------------------------------------+
```

---

## 14.3 Class Diagram (Simplified)

```text
+--------------------+
|       User         |
+--------------------+
| id                 |
| supabase_user_id   |
| email              |
| role               |
+--------------------+
        |
        | 1
        |
        | 1
+----------------------+
|    UserProfile       |
+----------------------+
| height               |
| weight               |
| goal                 |
+----------------------+

        |
        | 1
        |
        | *
+----------------------+
|        Meal          |
+----------------------+
| meal_date            |
| meal_type            |
| total_calories       |
+----------------------+
        |
        | 1
        |
        | *
+----------------------+
|      MealItem        |
+----------------------+
| quantity             |
| calories             |
| protein              |
+----------------------+
        |
   +----+----+
   |         |
   |         |
   ▼         ▼
+-----------+     +---------------+
|   Food    |     |  CustomFood   |
+-----------+     +---------------+

User
 |
 | 1
 |
 | *
 ▼
Recipe
 |
 | 1
 |
 | *
 ▼
RecipeItem
```

---

## 14.4 Sequence Diagram – Meal Logging

```text
User
 |
 | Enter Meal
 ▼
Frontend
 |
 | POST /meals
 ▼
Meal Router
 |
 ▼
Meal Service
 |
 | Meal Text
 ▼
AI Service
 |
 ▼
OpenAI API
 |
 | Structured Foods
 ▼
Nutrition Engine
 |
 ▼
Food Repository
 |
 ▼
PostgreSQL
 |
 | Nutrition Values
 ▼
Nutrition Engine
 |
 ▼
Meal Repository
 |
 ▼
PostgreSQL
 |
 ▼
Frontend
 |
 ▼
Dashboard Updated
```

---

## 14.5 Deployment Diagram

```text
+-------------------------+
|     User Device         |
|-------------------------|
| React Web App           |
| Electron Desktop App    |
+------------+------------+
             |
             | HTTPS
             ▼
+-------------------------+
|      FastAPI Server     |
|-------------------------|
| REST API                |
| AI Service              |
| Nutrition Engine        |
+------------+------------+
             |
      +------+------+
      |             |
      ▼             ▼
+-----------+   +----------------------+
| PostgreSQL|   | OpenAI-Compatible AI |
+-----------+   +----------------------+
```

---

## 14.6 Entity Relationship Diagram (ERD)

```text
User
 ├───────────────┐
 │               │
 ▼               ▼
UserProfile     Meal
                 │
                 ▼
              MealItem
              /      \
             /        \
            ▼          ▼
         Food      CustomFood

User
 ├───────────────┐
 │               │
 ▼               ▼
Recipe        WaterLog
 │
 ▼
RecipeItem
```

---

## Diagram Notes

- All diagrams represent the MVP architecture.
- Future versions may introduce additional components, such as mobile applications, barcode scanning, image recognition, and wearable integrations.
- Diagrams should be updated whenever significant architectural changes are made.
