# NutriTrack - Project Handoff Summary (Updated)

## Project Status

**Current Phase:** API Design Documentation

**Completion Status**

| Phase                                     | Status |
| ----------------------------------------- | ------ |
| Repository Setup                          | ✅      |
| Project Charter                           | ✅      |
| Software Requirements Specification (SRS) | ✅      |
| Software Design Document (SDD)            | ✅      |
| Database Design Document (DDD)            | ✅      |
| API Design Document                       | ⏳ Next |
| UI/UX Design                              | ⏳      |
| AI Integration Design                     | ⏳      |
| Testing Strategy                          | ⏳      |
| Deployment Guide                          | ⏳      |
| Development                               | ❌      |

No application code has been written yet.

---

# Project Overview

NutriTrack is an AI-powered nutrition tracking application that enables users to log meals using natural language instead of manually searching food databases.

The AI is **not responsible for nutrition calculations**.

Its only responsibility is converting natural language into structured food items.

Example:

Input

"I ate 2 eggs and one banana."

Output

```json
{
  "foods": [
    {
      "name": "Egg",
      "quantity": 2,
      "unit": "piece"
    },
    {
      "name": "Banana",
      "quantity": 1,
      "unit": "piece"
    }
  ]
}
```

All nutrition calculations are performed by the backend using a local PostgreSQL nutrition database.

---

# Project Goal

Develop a portfolio-quality Web and Desktop nutrition tracking application that allows users to:

- Register/Login
- Create a health profile
- Calculate personalized nutrition goals
- Log meals using natural language
- Automatically calculate nutrition
- Track water intake
- View dashboards
- View meal history
- Create custom foods
- Create recipes
- Export PDF reports

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Recharts

## Desktop

- Electron

## Backend

- FastAPI
- Python

## Database

- PostgreSQL

## ORM

- SQLAlchemy

## AI

- OpenAI Compatible API

## Authentication

- JWT
- Google OAuth (Future)

---

# Documentation Structure

```
docs/
│
├── 01_Project_Charter.md             ✅
├── 02_SRS.md                         ✅
├── 03_SDD.md                         ✅
├── 04_Database_Design.md             ✅
├── 05_API_Design.md                  ⏳
├── 06_UI_UX_Design.md                ⏳
├── 07_AI_Integration.md              ⏳
├── 08_Testing_Strategy.md            ⏳
├── 09_Deployment.md                  ⏳
├── 10_Project_Roadmap.md             ⏳
├── 11_Architecture_Decisions.md      ⏳
└── diagrams/
```

---

# Completed Documents

## 01_Project_Charter.md

Completed.

Contains:

- Vision
- Mission
- Scope
- Objectives
- Stakeholders
- Risks
- Success Criteria

---

## 02_SRS.md

Completed.

Contains:

- Functional Requirements
- Non-functional Requirements
- Use Cases
- User Stories
- Acceptance Criteria
- Future Enhancements

---

## 03_SDD.md

Completed.

Contains:

1. Introduction
2. Design Goals
3. System Architecture
4. Component Design
5. Module Design
6. Database Design Overview
7. Class Design
8. Sequence Diagrams
9. Deployment Architecture
10. Security Design
11. Error Handling
12. Design Patterns
13. Technology Justification
14. System Diagrams

## 04_Database_Design.md

Completed.

Contains:

- Database Philosophy
- Naming Conventions
- Design Principles
- Table Specifications
- Relationships
- Constraints
- Indexing Strategy
- Normalization
- Data Integrity Rules
- Data Dictionary
- Migration Strategy
- Future Expansion

---

# Architecture Decisions (Locked)

## ADR-001

AI extracts food only.

Backend calculates nutrition.

✅ Approved

---

## ADR-002

Use local PostgreSQL nutrition database.

No nutrition API.

✅ Approved

---

## ADR-003

Meal types:

- Breakfast
- Lunch
- Dinner
- Snack

✅ Approved

---

## ADR-004

Meal History

Users can:

- View
- Edit
- Delete
- Filter

✅ Approved

---

## ADR-005

Micronutrients

Rejected for Version 1.

Only:

- Calories
- Protein
- Carbs
- Fat
- Fiber
- Sugar
- Water

❌ Rejected

---

## ADR-006

Authentication

Architecture supports:

- Email & Password
- Google OAuth

Implementation:

V1:

Email

V2:

Google OAuth

✅ Approved

---

## ADR-007

Custom Foods

Users can create:

- Custom Foods
- Recipes

✅ Approved

---

## ADR-008

Meal Time

Manual meal time not required.

Meal Date only.

❌ Rejected

---

## ADR-009

Architecture Style

Layered Architecture.

✅ Approved

---

## ADR-010

Project Organization

Feature-Based Modular Architecture.

Each module contains:

- router.py
- service.py
- repository.py
- models.py
- schemas.py

✅ Approved

---

## ADR-011

Nutrition Engine

Introduce a dedicated Nutrition Engine responsible for:

- Food lookup
- Nutrition calculations
- Aggregation
- Meal totals

No other module performs nutrition calculations.

✅ Approved

---

## ADR-012

User Separation

Authentication data and profile data are stored separately.

Tables:

- User
- UserProfile

✅ Approved

---

## ADR-013

Meal Totals

Store calculated totals inside the Meal table.

Nutrition Engine keeps them synchronized.

This is intentional denormalization for better performance.

✅ Approved

---

AI Metadata

Meal stores:

- ai_provider
- ai_model
- ai_status
- processing_time_ms
- confidence_score

Purpose:

Support debugging, analytics and future AI provider comparisons.

✅ Approved

Meal Audit Information

Meal stores:

- source
- is_edited
- edited_at

Purpose:

Track meal origin and edit history.

✅ Approved

Role-Based Access Control (RBAC)

User table includes:

role

Supported roles:

- user
- admin

Version 1 primarily uses the user role while reserving the admin role for future administrative capabilities.

✅ Approved

# Final Architecture

```
React / Electron
        │
        ▼
FastAPI Router
        │
        ▼
Service Layer
        │
        ├─────────────┐
        ▼             ▼
AI Service     Nutrition Engine
        │             │
        ▼             ▼
 OpenAI API    Repository Layer
                     │
                     ▼
               PostgreSQL
```

---

# Backend Architecture

```
backend/
│
└── app/
    │
    ├── core/
    ├── auth/
    ├── users/
    ├── profiles/
    ├── meals/
    ├── nutrition/
    ├── dashboard/
    ├── water/
    ├── reports/
    ├── recipes/
    ├── custom_foods/
    ├── ai/
    ├── database/
    ├── utils/
    └── main.py
```

Each feature contains:

- router.py
- service.py
- repository.py
- models.py
- schemas.py

---

# Core Database Entities

User

- id
- email
- password_hash
- auth_provider
- role
- is_active
- created_at
- updated_at

---

# Design Patterns

Implemented:

- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Dependency Injection
- DTO (Pydantic)
- Singleton
- Factory Pattern (Future AI Providers)

---

# Development Philosophy

Documentation First.

Workflow

Project Charter

↓

SRS

↓

SDD

↓

Database Design

↓

API Design

↓

UI/UX Design

↓

AI Integration

↓

Development

Every implementation must follow the approved documentation.

---

| Document          | Status |
| ----------------- | ------ |
| GitHub Repository | ✅      |
| Project Charter   | ✅      |
| SRS               | ✅      |
| SDD               | ✅      |
| Database Design   | ✅      |
| API Design        | ⏳      |
| UI/UX Design      | ⏳      |
| AI Integration    | ⏳      |
| Testing Strategy  | ⏳      |
| Deployment        | ⏳      |
| Development       | ❌      |


---

# Immediate Next Step

Create:

docs/05_API_Design.md

This document will define:

- REST API Endpoints
- Authentication APIs
- User APIs
- Profile APIs
- Meal APIs
- Dashboard APIs
- Water APIs
- Recipe APIs
- Custom Food APIs
- Request Models
- Response Models
- Validation Rules
- HTTP Status Codes
- Error Responses
- API Versioning

The API Design document will act as the contract between the frontend and backend, ensuring both sides are developed consistently.

- Documentation is the single source of truth.
- AI is responsible only for natural language understanding.
- The Nutrition Engine owns all nutrition calculations.
- Services own business logic.
- Repositories own database access.
- Routers contain no business logic.
- Frontend communicates only through REST APIs.
- SQLAlchemy is the source of the database schema.
- Alembic manages all database migrations.
- PostgreSQL is the authoritative data store.
- Architecture decisions are locked unless formally revised.