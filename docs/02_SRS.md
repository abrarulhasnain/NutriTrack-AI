# Software Requirements Specification (SRS)

**Project:** NutriTrack  
**Version:** 1.0 (MVP)  
**Prepared By:** Muhammad Abrar  
**Date:** 21 July 2026

---

# 1. Introduction

## 1.1 Purpose
This document defines the functional and non-functional requirements for NutriTrack, an AI-powered nutrition tracking application. It serves as the baseline for design, implementation, testing, and maintenance.

## 1.2 Scope
NutriTrack allows users to:
- Create a profile
- Calculate personalized nutrition goals
- Log meals using natural language
- Use AI to extract food items from meal descriptions
- Calculate nutrition using a local nutrition database
- Track daily nutrition and water intake
- Export reports as PDF
- Use the application through Web and Desktop clients

Excluded from MVP:
- Exercise tracking
- Barcode scanning
- Image recognition
- Voice input
- Notifications
- Mobile apps
- Social features

## 1.3 Definitions
| Term | Meaning |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| MVP | Minimum Viable Product |
| SRS | Software Requirements Specification |
| SDD | Software Design Document |

## 1.4 References
- Project Charter
- IEEE 29148
- FastAPI Documentation
- React Documentation
- PostgreSQL Documentation
- OpenAI API Documentation

## 1.5 Overview
The remaining sections describe the product, requirements, interfaces, quality attributes, user stories, and future enhancements.

---

# 2. Overall Description

## 2.1 Product Perspective

NutriTrack is an AI-powered nutrition tracking system designed to simplify dietary monitoring through natural language processing and automated nutritional analysis. The system follows a layered client-server architecture consisting of a React-based frontend, a FastAPI backend, a PostgreSQL database, and an external AI service for food extraction.

The frontend communicates with the backend using secure REST APIs. The backend is responsible for authentication, business logic, nutrition calculations, data persistence, and communication with the AI service. The AI service extracts structured food items from user-provided meal descriptions, while the backend calculates nutritional values using a local nutrition database.

---

## 2.2 Product Functions

The system provides the following major capabilities:

- User profile management
- Personalized nutrition goal calculation
- Natural language meal logging
- AI-powered food extraction
- Nutrition calculation using a local database
- Daily nutrition tracking
- Water intake tracking
- Historical meal records
- Dashboard and analytics
- PDF report generation
- User account management

---

## 2.3 User Classes

### Guest User

A guest user can explore the application's interface but cannot store personal information or nutrition history.

### Registered User

A registered user can:

- Create and update a personal profile
- Receive personalized nutrition goals
- Log meals
- View daily nutrition progress
- Track water intake
- Export reports
- Delete their account

---

## 2.4 Operating Environment

### Client

- Modern Web Browsers
- Windows Desktop Application

### Backend

- Python 3.12+
- FastAPI

### Database

- PostgreSQL

### AI Integration

- OpenAI-compatible API

### Network

An internet connection is required only for AI-powered food extraction.

---

## 2.5 Design Constraints

The following constraints apply to Version 1:

- The system shall use REST APIs.
- Nutrition values shall be calculated from the local nutrition database.
- AI shall only identify food items and quantities.
- Backend shall validate all AI responses before processing.
- The application shall support future AI providers without major architectural changes.

---

## 2.6 Assumptions and Dependencies

### Assumptions

- Users provide accurate meal descriptions.
- Users enter reasonable serving quantities.
- Nutrition values are estimates and not medical advice.

### Dependencies

- OpenAI-compatible API
- PostgreSQL Database
- Internet connection for AI request
  
---

# 3. Functional Requirements

## FR-1 User Profile Management

### Description
The system shall allow users to create and manage their personal profile.

### Requirements

FR-1.1 The system shall allow users to create a profile.

FR-1.2 The system shall allow users to edit their profile.

FR-1.3 The system shall allow users to delete their profile.

FR-1.4 The system shall store:
- Name
- Age
- Gender
- Height
- Weight
- Activity Level
- Fitness Goal (Lose Weight / Maintain / Gain Muscle)

FR-1.5 The system shall automatically calculate daily nutrition goals after profile creation.

---

## FR-2 Nutrition Goal Calculation

### Description

The system shall calculate personalized daily nutrition goals.

### Requirements

FR-2.1 Calculate daily calorie requirement.

FR-2.2 Calculate protein goal.

FR-2.3 Calculate carbohydrate goal.

FR-2.4 Calculate fat goal.

FR-2.5 Calculate water intake goal.

FR-2.6 Allow users to manually override calculated goals.

---

### FR-3.4 
Every meal shall contain the following information:

- Meal ID
- User ID
- Meal Type (Breakfast, Lunch, Dinner, Snack)
- Date
- Time
- Original User Input
- Extracted Food Items
- Calculated Nutrition

### Description

The system shall allow users to log meals using natural language.

### Requirements

FR-3.1 Users shall enter meal descriptions in plain English.

Example:

"I ate 2 boiled eggs, 1 banana and a glass of milk."

FR-3.2 Users shall be able to edit meal entries.

FR-3.3 Users shall be able to delete meal entries.

FR-3.4 Every meal shall have:

- Date
- Time
- Meal Type (Breakfast, Lunch, Dinner, Snack)
- Original User Text

---

## FR-4 AI Food Extraction

### Description

The AI service shall identify food items from meal descriptions.

### Requirements

FR-4.1 Backend shall send meal text to AI.

FR-4.2 AI shall return JSON only.

FR-4.3 AI shall identify:

- Food Name
- Quantity
- Unit

Example:

```json
{
  "foods": [
    {
      "name": "Egg",
      "quantity": 2,
      "unit": "piece"
    }
  ]
}
```

FR-4.4 Backend shall validate AI response.

FR-4.5 Invalid AI responses shall be rejected.

---

## FR-5 Nutrition Calculation

### Description

The backend shall calculate nutrition using the local database.

### Requirements

FR-5.1 Search food database.

FR-5.2 Match extracted food.

FR-5.3 Calculate:

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Sugar

FR-5.4 Aggregate totals.

FR-5.5 Store calculated nutrition.

---

## FR-6 Dashboard

### Description

The dashboard shall display daily nutrition progress.

### Requirements

FR-6.1 Display:

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Sugar
- Water Intake

FR-6.2 Display remaining daily goals.

FR-6.3 Display progress bars.

FR-6.4 Display today's meals.

---

## FR-7 Water Tracking

### Description

The system shall allow manual water tracking.

### Requirements

FR-7.1 Add water intake.

FR-7.2 Edit water intake.

FR-7.3 Delete water entries.

FR-7.4 Display daily progress.

---

## FR-8 Reports

### Description

Users shall be able to export reports.

### Requirements

FR-8.1 Export PDF.

FR-8.2 Include:

- Daily Summary
- Nutrition Totals
- Goal Achievement

---

## FR-9 Settings

### Requirements

FR-9.1 Update profile.

FR-9.2 Change nutrition goals.

FR-9.3 Delete account.

---

## FR-10 Error Handling

### Requirements

FR-10.1 Display user-friendly error messages.

FR-10.2 Retry AI requests when appropriate.

FR-10.3 Prevent invalid data from being stored.

FR-10.4 Log application errors.

---

---

## FR-11 Meal History

### Description

The system shall maintain a complete history of all meals logged by the user.

### Requirements

FR-11.1 The system shall store every meal permanently until deleted by the user.

FR-11.2 Users shall be able to view meals by date.

FR-11.3 Users shall be able to search meal history.

FR-11.4 Users shall be able to filter meals by:
- Date
- Meal Type

FR-11.5 Users shall be able to edit previously logged meals.

FR-11.6 Users shall be able to delete previously logged meals.

FR-11.7 Historical nutrition data shall automatically update the dashboard and reports when modified.

---

## FR-12 Custom Foods & Recipes

### Description

The system shall allow users to create and manage custom food items and recipes for frequently consumed meals.

### Requirements

FR-12.1 Users shall be able to create custom food items.

FR-12.2 Users shall be able to create custom recipes containing multiple ingredients.

FR-12.3 Users shall be able to edit custom foods and recipes.

FR-12.4 Users shall be able to delete custom foods and recipes.

FR-12.5 Users shall be able to search their custom foods.

FR-12.6 Custom foods shall appear in AI search results when appropriate.

FR-12.7 The nutritional values of custom foods shall be included in daily calculations.

---

# 4. External Interface Requirements

## 4.1 User Interface

The user interface shall provide the following screens:

- Landing Page
- Login / Registration
- Dashboard
- Meal Logging
- Meal History
- Water Tracking
- Reports
- Settings
- Profile

### UI Requirements

UI-1 The interface shall be responsive.

UI-2 Navigation shall remain consistent across all pages.

UI-3 Users shall receive visual feedback after every successful action.

UI-4 Progress shall be displayed using charts and progress bars.

UI-5 Forms shall validate user input before submission.

---

## 4.2 Software Interfaces

The system shall communicate with:

### AI Service

Purpose:
- Extract food items from natural language.

Communication:
- HTTPS
- JSON

---

### PostgreSQL Database

Purpose:
- Store application data.

Communication:
- SQLAlchemy ORM

---

## 4.3 Communication Interfaces

Communication between frontend and backend shall use:

- REST API
- HTTPS
- JSON

---

## 4.4 Hardware Interfaces

No specialized hardware is required.

The application shall run on standard desktop and laptop computers with internet access.

---

# 5. Non-Functional Requirements

## 5.1 Performance

NFR-1 Dashboard shall load within 2 seconds under normal conditions.

NFR-2 AI meal analysis should complete within 10 seconds.

NFR-3 Nutrition calculations shall complete within 2 seconds after AI extraction.

NFR-4 The system shall support at least 1,000 meals per user without noticeable performance degradation.

---

## 5.2 Reliability

NFR-5 The application shall validate all AI responses before processing.

NFR-6 Invalid AI responses shall not be stored.

NFR-7 The application shall gracefully handle API failures.

NFR-8 Unexpected errors shall be logged.

---

## 5.3 Availability

NFR-9 The application shall remain usable even if AI services are temporarily unavailable, except for new meal analysis.

NFR-10 Previously saved meals and reports shall remain accessible.

---

## 5.4 Security

NFR-11 Passwords shall be securely hashed.

NFR-12 Sensitive data shall never be stored in plain text.

NFR-13 All API communication shall use HTTPS.

NFR-14 Users shall only access their own data.

---

## 5.5 Usability

NFR-15 The application shall be easy to use for first-time users.

NFR-16 Navigation shall be consistent across all pages.

NFR-17 Users shall be able to log a meal in less than 30 seconds.

---

## 5.6 Maintainability

NFR-18 The system shall follow a modular architecture.

NFR-19 Business logic, AI integration, and database access shall be separated into independent modules.

NFR-20 Source code shall follow consistent coding standards.

---

## 5.7 Scalability

NFR-21 The architecture shall support future AI providers with minimal code changes.

NFR-22 The database shall support future nutrition attributes and additional features.

NFR-23 The backend shall support future mobile applications without major architectural changes.

---

# 6. Use Cases

### UC-1 Create Profile
Actor: User

Flow:
1. Open profile page
2. Enter details
3. Save
4. Goals calculated

### UC-2 Log Meal
1. Enter meal text
2. Backend calls AI
3. AI extracts foods
4. Nutrition calculated
5. Dashboard updated

### UC-3 Export Report
1. Open reports
2. Select PDF
3. Download report

---

# 7. User Stories

- As a user, I want to log meals naturally.
- As a user, I want nutrition goals.
- As a user, I want daily progress.
- As a user, I want PDF reports.
- As a user, I want to delete my account.

---

# 8. Acceptance Criteria

- Profile creation works.
- Meal analysis returns nutrition.
- Dashboard updates.
- Water tracking functions.
- PDF export works.

---

# 9. Future Enhancements

- Food image recognition
- Barcode scanner
- Voice input
- AI nutrition coach
- Grocery recommendations
- Mobile applications
- Exercise tracking

---
End of SRS
