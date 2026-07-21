# System Architecture

## High-Level Architecture

```text
                +----------------------+
                |   React Frontend     |
                +----------+-----------+
                           |
                     REST API (HTTPS)
                           |
                           ▼
                +----------------------+
                | FastAPI Backend       |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                                 |
          ▼                                 ▼
+----------------------+        +----------------------+
| AI Service           |        | Nutrition Service    |
| (Food Extraction)    |        | (Business Logic)     |
+----------+-----------+        +----------+-----------+
           |                               |
           ▼                               ▼
     OpenAI API                  PostgreSQL Database
```

---

## Components

### Frontend
- User Interface
- Authentication
- Dashboard
- Meal Logging
- Reports

### Backend
- REST API
- Authentication
- Business Logic
- Validation

### AI Service
- Convert natural language into structured food items.
- Return JSON only.

### Nutrition Service
- Search food database.
- Calculate nutrition.
- Aggregate totals.

### Database
- User data
- Meals
- Meal items
- Nutrition data