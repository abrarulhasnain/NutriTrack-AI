# Database Design Document (DDD)

## Document Information

| Field | Value |
|-------|-------|
| Project | NutriTrack |
| Version | 1.0 |
| Status | Draft |
| Author | Muhammad Abrar |
| Database | PostgreSQL |
| ORM | SQLAlchemy |

---

# 1. Introduction

## 1.1 Purpose

This document defines the complete database architecture for NutriTrack.

It specifies:

- Database philosophy
- Tables
- Columns
- Relationships
- Constraints
- Indexes
- Naming conventions
- Data integrity rules

This document serves as the single source of truth for database implementation.

---

## 1.2 Scope

This document covers all persistent data used in Version 1 of NutriTrack, including:

- User accounts
- User profiles
- Meals
- Meal items
- Food database
- Water tracking
- Custom foods
- Recipes
- Recipe ingredients

Future features (barcode scanning, wearable devices, image recognition, etc.) are intentionally excluded.

---

# 2. Database Philosophy

NutriTrack uses a relational database (PostgreSQL) designed according to the following principles:

- Third Normal Form (3NF)
- Strong data integrity
- Minimal redundancy
- High query performance
- Clear entity relationships
- Scalable schema design
- Separation of authentication and profile data

The system uses controlled denormalization only where justified for performance (e.g., meal nutrition totals).

---

# 3. Naming Conventions

## Tables

- Singular nouns
- PascalCase

Examples:

- User
- Meal
- Recipe
- Food

---

## Columns

- snake_case

Examples:

- created_at
- updated_at
- meal_date
- activity_level

---

## Primary Keys

Every table uses:

id UUID PRIMARY KEY

Except:

UserProfile

uses:

user_id

as both Primary Key and Foreign Key.

---

## Foreign Keys

Format:

<table_name>_id

Examples:

user_id

meal_id

food_id

recipe_id

---

## Timestamp Fields

Every transactional table includes:

created_at

updated_at

unless explicitly unnecessary.

---

# 4. Database Design Principles

The schema follows these rules:

- No duplicated user information.
- Authentication is separated from profile data.
- Nutrition calculations occur outside the database.
- Nutrition totals are stored for performance.
- Foreign key constraints are enforced.
- Nullable fields are minimized.
- Every entity has a clear owner.

# 5. Table Specifications

---

# 5.1 User

## Purpose

Stores authentication and account information.

## Table Definition

| Column | Data Type | Constraints | Description |
|---------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Encrypted password |
| auth_provider | VARCHAR(50) | NOT NULL DEFAULT 'email' | Authentication provider |
| is_active | BOOLEAN | NOT NULL DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

| Column | Data Type   | Constraints             | Description |
| ------ | ----------- | ----------------------- | ----------- |
| role   | VARCHAR(20) | NOT NULL DEFAULT 'user' | User role   |

### Allowed Roles

Version 1 supports the following roles:

| Role | Description |
|------|-------------|
| user | Standard application user |
| admin | System administrator |

Administrators have additional privileges, such as:

- Managing the master Food database
- Reviewing AI processing logs (future)
- Managing users (future)
- Viewing system statistics (future)

Role-based authorization shall be enforced by the backend.

Indexes

- email (Unique)

---

# 5.2 UserProfile

## Purpose

Stores health-related information used to calculate nutrition goals.

| Column | Data Type | Constraints | Description |
|---------|-----------|-------------|-------------|
| user_id | UUID | PRIMARY KEY, FK(User.id) | User reference |
| full_name | VARCHAR(100) | NOT NULL | Full name |
| age | INTEGER | NOT NULL | Age |
| gender | VARCHAR(20) | NOT NULL | Gender |
| height_cm | DECIMAL(5,2) | NOT NULL | Height in centimeters |
| weight_kg | DECIMAL(5,2) | NOT NULL | Weight in kilograms |
| activity_level | VARCHAR(50) | NOT NULL | Activity level |
| fitness_goal | VARCHAR(50) | NOT NULL | User goal |
| calorie_goal | INTEGER | NOT NULL | Daily calories |
| protein_goal | DECIMAL(6,2) | NOT NULL | Daily protein |
| carbs_goal | DECIMAL(6,2) | NOT NULL | Daily carbohydrates |
| fat_goal | DECIMAL(6,2) | NOT NULL | Daily fat |
| water_goal | INTEGER | NOT NULL | Daily water (ml) |
| created_at | TIMESTAMP | NOT NULL | Created |
| updated_at | TIMESTAMP | NOT NULL | Updated |

Relationship

User (1) ---- (1) UserProfile

---

# 5.3 Food

## Purpose

Master nutrition database.

This table is read-only during normal application usage.

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| serving_size | DECIMAL(8,2) | NOT NULL |
| serving_unit | VARCHAR(30) | NOT NULL |
| calories | DECIMAL(8,2) | NOT NULL |
| protein | DECIMAL(8,2) | NOT NULL |
| carbs | DECIMAL(8,2) | NOT NULL |
| fat | DECIMAL(8,2) | NOT NULL |
| fiber | DECIMAL(8,2) | NOT NULL |
| sugar | DECIMAL(8,2) | NOT NULL |

Indexes

- name

---

# 5.4 Meal

## Purpose

Represents one meal.

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK(User.id) |
| meal_date | DATE | NOT NULL |
| meal_type | VARCHAR(20) | NOT NULL |
| original_text | TEXT | NOT NULL |
| total_calories | DECIMAL(8,2) | NOT NULL |
| total_protein | DECIMAL(8,2) | NOT NULL |
| total_carbs | DECIMAL(8,2) | NOT NULL |
| total_fat | DECIMAL(8,2) | NOT NULL |
| total_fiber | DECIMAL(8,2) | NOT NULL |
| total_sugar | DECIMAL(8,2) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

| Column             | Data Type    | Constraints                  | Description                        |
| ------------------ | ------------ | ---------------------------- | ---------------------------------- |
| ai_provider        | VARCHAR(50)  | NULL                         | AI provider (e.g., OpenAI, Gemini) |
| ai_model           | VARCHAR(100) | NULL                         | Model used (e.g., GPT-5.5)         |
| ai_status          | VARCHAR(20)  | NOT NULL DEFAULT 'completed' | Processing status                  |
| processing_time_ms | INTEGER      | NULL                         | AI processing time in milliseconds |
| confidence_score   | DECIMAL(5,2) | NULL                         | AI confidence score (0–100)        |
| source    | VARCHAR(20) | manual, recipe, imported                        |
| is_edited | BOOLEAN     | Whether the meal has been edited after creation |
| edited_at | TIMESTAMP   | Last edit timestamp                             |


Allowed meal_type values

- Breakfast
- Lunch
- Dinner
- Snack

Indexes

- user_id
- meal_date

---

# 5.5 MealItem

## Purpose

Represents one food inside a meal.

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| meal_id | UUID | FK(Meal.id) |
| food_id | UUID | Nullable FK(Food.id) |
| custom_food_id | UUID | Nullable FK(CustomFood.id) |
| quantity | DECIMAL(8,2) | NOT NULL |
| unit | VARCHAR(30) | NOT NULL |
| calories | DECIMAL(8,2) | NOT NULL |
| protein | DECIMAL(8,2) | NOT NULL |
| carbs | DECIMAL(8,2) | NOT NULL |
| fat | DECIMAL(8,2) | NOT NULL |
| fiber | DECIMAL(8,2) | NOT NULL |
| sugar | DECIMAL(8,2) | NOT NULL |

Constraint

Exactly one of

food_id

or

custom_food_id

must contain a value.

---

# 5.6 WaterLog

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK(User.id) |
| date | DATE | NOT NULL |
| amount_ml | INTEGER | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

---

# 5.7 CustomFood

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK(User.id) |
| name | VARCHAR(200) | NOT NULL |
| serving_size | DECIMAL(8,2) | NOT NULL |
| serving_unit | VARCHAR(30) | NOT NULL |
| calories | DECIMAL(8,2) | NOT NULL |
| protein | DECIMAL(8,2) | NOT NULL |
| carbs | DECIMAL(8,2) | NOT NULL |
| fat | DECIMAL(8,2) | NOT NULL |
| fiber | DECIMAL(8,2) | NOT NULL |
| sugar | DECIMAL(8,2) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

# 5.8 Recipe

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK(User.id) |
| name | VARCHAR(150) | NOT NULL |
| description | TEXT | Nullable |
| servings | INTEGER | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

# 5.9 RecipeItem

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | UUID | PRIMARY KEY |
| recipe_id | UUID | FK(Recipe.id) |
| food_id | UUID | Nullable FK(Food.id) |
| custom_food_id | UUID | Nullable FK(CustomFood.id) |
| quantity | DECIMAL(8,2) | NOT NULL |
| unit | VARCHAR(30) | NOT NULL |

Constraint

Exactly one of

food_id

or

custom_food_id

must contain a value.

# 6. Relationships

This section defines the relationships between all database entities.

---

## 6.1 User ↔ UserProfile

Relationship: One-to-One (1:1)

User
│
└──────────────► UserProfile

Foreign Key

UserProfile.user_id → User.id

Delete Rule

ON DELETE CASCADE

---

## 6.2 User ↔ Meal

Relationship: One-to-Many (1:N)

User
│
├────────► Meal
├────────► Meal
├────────► Meal

Foreign Key

Meal.user_id → User.id

Delete Rule

ON DELETE CASCADE

---

## 6.3 Meal ↔ MealItem

Relationship: One-to-Many (1:N)

Meal
│
├────────► MealItem
├────────► MealItem

Foreign Key

MealItem.meal_id → Meal.id

Delete Rule

ON DELETE CASCADE

---

## 6.4 User ↔ WaterLog

Relationship: One-to-Many (1:N)

Foreign Key

WaterLog.user_id → User.id

Delete Rule

ON DELETE CASCADE

---

## 6.5 User ↔ CustomFood

Relationship: One-to-Many (1:N)

Foreign Key

CustomFood.user_id → User.id

Delete Rule

ON DELETE CASCADE

---

## 6.6 User ↔ Recipe

Relationship: One-to-Many (1:N)

Foreign Key

Recipe.user_id → User.id

Delete Rule

ON DELETE CASCADE

---

## 6.7 Recipe ↔ RecipeItem

Relationship: One-to-Many (1:N)

Foreign Key

RecipeItem.recipe_id → Recipe.id

Delete Rule

ON DELETE CASCADE

---

## 6.8 Food ↔ MealItem

Relationship: One-to-Many (1:N)

Foreign Key

MealItem.food_id → Food.id

Delete Rule

ON DELETE RESTRICT

---

## 6.9 CustomFood ↔ MealItem

Relationship: One-to-Many (1:N)

Foreign Key

MealItem.custom_food_id → CustomFood.id

Delete Rule

ON DELETE RESTRICT

---

## 6.10 Food ↔ RecipeItem

Relationship: One-to-Many (1:N)

Foreign Key

RecipeItem.food_id → Food.id

Delete Rule

ON DELETE RESTRICT

---

## 6.11 CustomFood ↔ RecipeItem

Relationship: One-to-Many (1:N)

Foreign Key

RecipeItem.custom_food_id → CustomFood.id

Delete Rule

ON DELETE RESTRICT

# 7. Database Constraints

## Primary Keys

Every table has a primary key.

Exception:

UserProfile

uses:

user_id

as both Primary Key and Foreign Key.

---

## Foreign Keys

All foreign keys shall be enforced.

---

## Unique Constraints

User.email

must be unique.

---

## Check Constraints

Meal.meal_type

Allowed values:

- Breakfast
- Lunch
- Dinner
- Snack

---

Meal.ai_status

Allowed values:

- pending
- completed
- failed

---

Meal.source

Allowed values:

- manual
- recipe
- imported

---

WaterLog.amount_ml > 0

---

MealItem.quantity > 0

---

Recipe.servings > 0

---

All nutrition values ≥ 0

# 8. Indexing Strategy

Indexes improve query performance.

## User

- email (Unique)

---

## Meal

- user_id
- meal_date
- meal_type

Composite Index

(user_id, meal_date)

---

## MealItem

- meal_id

---

## Food

- name

---

## CustomFood

Composite Index

(user_id, name)

---

## Recipe

- user_id

---

## WaterLog

Composite Index

(user_id, date)


# 9. Normalization

The database follows Third Normal Form (3NF).

Normalization Rules

- No duplicated user data.
- Authentication separated from profile.
- Meal items stored independently.
- Recipes normalized.
- Water tracking isolated.
- Custom foods isolated.

Controlled Denormalization

Meal nutrition totals are intentionally stored for performance.

The Nutrition Engine is responsible for keeping these totals synchronized.

# 10. Data Integrity Rules

The following rules shall always be enforced:

1. Every profile belongs to exactly one user.
2. Every meal belongs to exactly one user.
3. Every meal item belongs to exactly one meal.
4. Every recipe belongs to exactly one user.
5. Every recipe item belongs to exactly one recipe.
6. Every water log belongs to exactly one user.
7. Nutrition values cannot be negative.
8. Meal quantities must be greater than zero.
9. Emails must be unique.
10. Users cannot access another user's data.
11. The Nutrition Engine is the only component allowed to update meal totals.

# 11. Data Dictionary

This section provides a business-level description of each entity in the database.

| Entity | Description |
|---------|-------------|
| User | Stores authentication and account information. |
| UserProfile | Stores personal, health, and fitness information used to calculate nutrition goals. |
| Food | Master nutrition database containing standardized nutritional values. |
| Meal | Represents a meal logged by a user. |
| MealItem | Represents an individual food item within a meal. |
| CustomFood | Stores user-created food items. |
| Recipe | Stores reusable recipes created by users. |
| RecipeItem | Stores ingredients associated with recipes. |
| WaterLog | Stores daily water intake records. |

---

# 12. Database Implementation Strategy

The application uses SQLAlchemy ORM for database modeling and Alembic for schema migrations.

Database implementation will follow this workflow:

1. Create SQLAlchemy models.
2. Define relationships between models.
3. Generate Alembic migration files.
4. Apply migrations to PostgreSQL.
5. Seed the Food table with the nutrition dataset.

No manual SQL scripts will be maintained unless required for deployment or database optimization.

---

# 13. Migration Strategy

Schema changes will be managed using Alembic.

Migration principles:

- Every schema change must have a migration.
- Existing migrations must never be edited after being applied.
- Rollback support must be maintained.
- Database schema versioning will follow application releases.

---

# 14. Future Database Expansion

The current schema is designed for Version 1.

Future versions may introduce additional entities such as:

- Barcode
- FoodImage
- AIProcessingLog
- Notification
- UserSettings
- Device
- WearableIntegration
- Achievement
- Exercise
- ExerciseLog
- Supplement
- Reminder
- MealPlan

The existing schema has been designed to accommodate these additions with minimal structural changes.

---

# 15. Conclusion

The NutriTrack database is designed to provide a scalable, maintainable, and production-ready foundation for the application.

Key characteristics include:

- Third Normal Form (3NF)
- Strong referential integrity
- Feature-oriented schema
- Separation of authentication and profile data
- Dedicated Nutrition Engine ownership for nutrition calculations
- Controlled denormalization for performance
- Migration-based schema management using Alembic

This document serves as the authoritative reference for database implementation throughout the project lifecycle.

