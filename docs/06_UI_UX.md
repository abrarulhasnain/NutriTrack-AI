# UI/UX Design Document

## Document Information

| Field | Value |
|-------|-------|
| Project | NutriTrack |
| Document | UI/UX Design Document |
| Version | 1.0 |
| Status | Draft |
| Platform | Web & Desktop |
| Framework | React + Electron |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |

---

# Table of Contents

1. Design Philosophy
2. Design Goals
3. Target Users
4. Design Principles
5. Visual Identity
6. Color System
7. Typography
8. Spacing System
9. Iconography
10. Component Library
11. Navigation
12. Information Architecture
13. User Flows
14. Screen Specifications
15. Responsive Design
16. Accessibility
17. Empty States
18. Loading States
19. Error States
20. Animations
21. Future UI Improvements

---

# 1. Design Philosophy

NutriTrack is designed around one primary goal:

> Help users log meals and track nutrition as quickly and effortlessly as possible.

The interface prioritizes:

- Simplicity
- Speed
- Readability
- Consistency
- Accessibility

Every screen should minimize user effort and present only the information needed for the current task.

---

# 2. Design Goals

The UI should:

- Be easy to learn for first-time users.
- Minimize the number of clicks required to complete common tasks.
- Maintain a clean and distraction-free appearance.
- Provide immediate feedback after every user action.
- Work consistently across Web and Desktop platforms.
- Scale easily as new features are added.

---

# 3. Target Users

Primary users include:

- Gym enthusiasts
- Fitness beginners
- Individuals tracking weight loss or muscle gain
- Health-conscious users
- Students and professionals seeking an affordable nutrition tracker

---

# 4. Design Principles

## 4.1 Functional First

Functionality takes priority over decorative design.

---

## 4.2 Minimalism

Avoid unnecessary visual elements.

Only display information that provides value.

---

## 4.3 Consistency

Buttons, forms, cards, icons, spacing, and colors should behave consistently throughout the application.

---

## 4.4 Clear Hierarchy

Important information should always receive greater visual emphasis.

Examples:

- Daily calories
- Remaining protein
- Current goals

---

## 4.5 Immediate Feedback

Every user action should produce visible feedback.

Examples:

- Success messages
- Validation errors
- Loading indicators
- Progress updates

---

# 5. Visual Identity

Style:

- Modern
- Minimal
- Professional
- Clean
- Functional

The design should feel similar to modern productivity applications rather than traditional fitness apps.

---

# 6. Color System

## Primary Colors

| Purpose | Color |
|---------|-------|
| Primary | #38a861 |
| Secondary | #3B82F6 |
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |

---

## Neutral Colors

| Purpose | Color |
|---------|-------|
| Background | #0F172A |
| Surface | #1E293B |
| Card | #334155 |
| Border | #475569 |
| Text Primary | #F8FAFC |
| Text Secondary | #CBD5E1 |

---

# 7. Typography

Primary Font:

```
Inter
```

Fallback:

```
sans-serif
```

Typography Scale

| Element | Size |
|---------|------|
| H1 | 36px |
| H2 | 30px |
| H3 | 24px |
| H4 | 20px |
| Body | 16px |
| Small | 14px |
| Caption | 12px |

Text should maintain high contrast for readability.

---

# 8. Spacing System

The interface follows an 8-point spacing system.

Common spacing values:

| Value | Usage |
|--------|-------|
| 4px | Tight spacing |
| 8px | Small gaps |
| 16px | Standard spacing |
| 24px | Section spacing |
| 32px | Large spacing |
| 48px | Major sections |

---

# 9. Iconography

Icons should be:

- Simple
- Outline style
- Consistent size
- Easy to recognize

Recommended library:

```
Lucide React
```

Examples:

- Home
- User
- Search
- Calendar
- Water
- Settings
- Plus
- Edit
- Trash
- Download

---

# 10. Component Library

The application uses:

```
shadcn/ui
```

Core Components

- Button
- Card
- Input
- Label
- Select
- Dialog
- Dropdown Menu
- Popover
- Calendar
- Table
- Tabs
- Badge
- Avatar
- Progress
- Tooltip
- Toast
- Alert Dialog
- Skeleton
- Scroll Area

Custom Components

- Nutrition Card
- Goal Progress Card
- Meal Card
- Water Card
- Dashboard Summary Card
- Macro Progress Bar
- Daily Nutrition Ring
- Weekly Nutrition Chart

---

# 11. Navigation

Desktop Navigation

```
+-----------------------------------+
| Logo                              |
+-----------------------------------+

Dashboard

Meals
    • Add Meal
    • Meal History

Water

Recipes

Custom Foods

Profile

Settings

------------------------------------

Logout
```

Current page should always be highlighted.

---

# 12. Information Architecture

```
NutriTrack

├── Authentication
│      ├── Login
│      └── Register
│
├── Dashboard
│
├── Meals
│      ├── Add Meal
│      ├── History
│      └── Details
│
├── Water
│
├── Recipes
│
├── Custom Foods
│
├── Profile
│
└── Settings
```

---

# 13. User Flows

## First-Time User

```
Register

↓

Create Profile

↓

Calculate Goals

↓

Dashboard

↓

Add First Meal

↓

View Progress
```

---

## Daily User

```
Login

↓

Dashboard

↓

Add Meal

↓

View Nutrition

↓

Update Water

↓

Logout
```

---

## Recipe Workflow

```
Recipes

↓

Create Recipe

↓

Add Ingredients

↓

Save

↓

Use in Meals
```

---

## Custom Food Workflow

```
Custom Foods

↓

Create Food

↓

Save

↓

Available in Meal Logging
```

---

# End of Part 1

The following sections will be completed in the remaining parts:

- Screen Specifications
- Wireframes
- Responsive Design
- Accessibility
- Components
- Empty States
- Loading States
- Error States
- Animations
- Future UI Enhancements

# 14. Screen Specifications

---

# 14.1 Login Screen

## Purpose

Allows existing users to securely sign in.

---

## Layout

```
+------------------------------------------------------+
|                      NutriTrack                      |
|------------------------------------------------------|
|                                                      |
|                  Welcome Back 👋                     |
|                                                      |
| Email Address                                        |
| [______________________________]                     |
|                                                      |
| Password                                             |
| [______________________________]                     |
|                                                      |
| ( ) Remember Me                                      |
|                                                      |
|        [ Login ]                                     |
|                                                      |
| Don't have an account? Register                      |
|                                                      |
+------------------------------------------------------+
```

---

## Components

- Logo
- Email Input
- Password Input
- Remember Me Checkbox
- Login Button
- Register Link
- Toast Notifications

---

## Validation

- Required fields
- Email format
- Password length
- Invalid credentials

---

## User Actions

- Login
- Navigate to Register

---

# 14.2 Register Screen

## Purpose

Creates a new account.

---

## Layout

```
+------------------------------------------------------+
|                   Create Account                     |
|------------------------------------------------------|
|                                                      |
| Email                                                |
| [________________________]                           |
|                                                      |
| Password                                             |
| [________________________]                           |
|                                                      |
| Confirm Password                                     |
| [________________________]                           |
|                                                      |
|             [ Register ]                             |
|                                                      |
| Already have an account? Login                       |
|                                                      |
+------------------------------------------------------+
```

---

## Components

- Email
- Password
- Confirm Password
- Register Button

---

## Validation

- Email required
- Password policy
- Password confirmation
- Duplicate email

---

## Success Flow

```
Register

↓

Create Profile
```

---

# 14.3 Dashboard

## Purpose

Displays the user's nutrition progress and today's summary.

---

## Layout

```
+--------------------------------------------------------------+
| Sidebar |                  Header                            |
|---------|----------------------------------------------------|
|         |                                                    |
|         | Today's Nutrition                                  |
|         |                                                    |
|         | Calories     Protein                               |
|         | ███████░░    ████████░                             |
|         |                                                    |
|         | Carbs       Fat                                   |
|         | ██████░░     █████░░                               |
|         |                                                    |
|---------|----------------------------------------------------|
|         | Today's Water                                      |
|         | ██████░░░                                          |
|---------|----------------------------------------------------|
|         | Recent Meals                                       |
|         |                                                    |
|         | Breakfast                                          |
|         | Lunch                                              |
|         | Dinner                                             |
|--------------------------------------------------------------|
```

---

## Dashboard Cards

- Calories
- Protein
- Carbs
- Fat
- Water

---

## Charts

- Weekly Calories
- Weekly Protein
- Macronutrient Distribution

---

## Quick Actions

- Add Meal
- Add Water
- View Meal History

---

## Components

- Sidebar
- Header
- Progress Cards
- Charts
- Recent Meals Table
- Quick Action Buttons

---

# 14.4 Add Meal Screen

## Purpose

Allows users to log meals using natural language.

---

## Layout

```
+------------------------------------------------------+
|                  Add Meal                            |
|------------------------------------------------------|
| Meal Type                                            |
| [ Breakfast ▼ ]                                      |
|                                                      |
| Date                                                 |
| [ 2026-07-22 ]                                       |
|                                                      |
| What did you eat today?                              |
|                                                      |
| _____________________________________________        |
| | I ate 2 eggs, bread and banana          |          |
| |                                         |          |
| |_________________________________________|          |
|                                                      |
|            [ Analyze Meal ]                          |
+------------------------------------------------------+
```

---

## Components

- Meal Type Dropdown
- Date Picker
- Large Text Area
- Analyze Button

---

## Processing Flow

```
User

↓

Write Meal

↓

Click Analyze

↓

Loading Spinner

↓

AI Extraction

↓

Nutrition Calculation

↓

Meal Summary

↓

Save Meal
```

---

## Meal Result

```
Calories

Protein

Carbs

Fat

Fiber

Sugar

Recognized Foods

Save Button
```

---

# 14.5 Meal History

## Purpose

Displays previously logged meals.

---

## Layout

```
+---------------------------------------------------------------+
| Meal History                                                  |
|---------------------------------------------------------------|
| Search ______________________                                 |
|                                                               |
| Filter: Breakfast ▼                                           |
| Date Range                                                    |
|---------------------------------------------------------------|
| Date       Meal         Calories     Protein                  |
|---------------------------------------------------------------|
| Jul 22     Breakfast      610          31                     |
| Jul 22     Lunch          845          52                     |
| Jul 21     Dinner         710          45                     |
|---------------------------------------------------------------|
```

---

## Components

- Search Box
- Meal Type Filter
- Date Filter
- Sort Dropdown
- Table
- Pagination

---

## Table Columns

- Date
- Meal Type
- Calories
- Protein
- Carbs
- Fat
- Actions

---

## Row Actions

- View
- Edit
- Delete

---

## Navigation Flow

```
Dashboard

↓

Meal History

↓

Meal Details

↓

Edit Meal

↓

Save
```

---

# Screen Design Guidelines

All screens should follow these rules:

### Cards

- Rounded corners
- Soft shadow
- Consistent padding

---

### Buttons

Primary

- Green

Secondary

- Blue

Danger

- Red

---

### Inputs

- Rounded
- Full width
- Clear labels
- Inline validation

---

### Tables

- Zebra rows
- Sticky headers
- Pagination
- Search
- Sorting

---

### Forms

Every form should provide:

- Required field indicators
- Validation messages
- Loading state
- Success notification
- Error notification

---

# End of Part 2

Completed Screens

- Login
- Register
- Dashboard
- Add Meal
- Meal History

Remaining Screens

- Meal Details
- Water Tracking
- Recipes
- Custom Foods
- Profile
- Settings

# 14.6 Meal Details Screen

## Purpose

Displays complete information about a logged meal.

---

## Layout

```
+------------------------------------------------------+
| ← Back                                                |
|------------------------------------------------------|
| Breakfast                     Jul 22, 2026           |
|------------------------------------------------------|
| Original Text                                         |
| "2 eggs, bread and banana"                           |
|------------------------------------------------------|
| Foods                                                |
|------------------------------------------------------|
| Egg              2 pcs                               |
| Bread            3 slices                            |
| Banana           1 piece                             |
|------------------------------------------------------|
| Calories     610                                     |
| Protein      31g                                     |
| Carbs        58g                                     |
| Fat          20g                                     |
| Fiber         7g                                     |
| Sugar        15g                                     |
|------------------------------------------------------|
| [ Edit Meal ]      [ Delete Meal ]                  |
+------------------------------------------------------+
```

---

## Components

- Nutrition Summary
- Food List
- Edit Button
- Delete Button
- Back Button

---

# 14.7 Water Tracking Screen

## Purpose

Allows users to monitor and update daily water intake.

---

## Layout

```
+------------------------------------------------------+
| Water Tracking                                       |
|------------------------------------------------------|
| Goal         3500 ml                                 |
| Drank        2200 ml                                 |
| Remaining    1300 ml                                 |
|------------------------------------------------------|
| Progress                                           |
| ███████████████░░░░░░░░                              |
|------------------------------------------------------|
| Quick Add                                           |
| [+250ml] [+500ml] [+750ml] [+1000ml]               |
|------------------------------------------------------|
| Today's Entries                                     |
| 09:00   500ml                                       |
| 12:30   750ml                                       |
| 15:45   950ml                                       |
+------------------------------------------------------+
```

---

## Components

- Progress Bar
- Statistics Cards
- Quick Add Buttons
- History Table

---

# 14.8 Recipes Screen

## Purpose

Displays all user-created recipes.

---

## Layout

```
+------------------------------------------------------+
| Recipes                              + New Recipe    |
|------------------------------------------------------|
| Search ______________________________                |
|------------------------------------------------------|
| High Protein Breakfast                >              |
| Chicken Rice Bowl                     >              |
| Oats Shake                            >              |
|------------------------------------------------------|
```

---

## Components

- Search
- Recipe List
- Add Button
- Edit
- Delete

---

# Recipe Details

Displays:

- Ingredients
- Nutrition
- Edit Recipe
- Delete Recipe

---

# 14.9 Custom Foods Screen

## Purpose

Allows users to manage custom food entries.

---

## Layout

```
+------------------------------------------------------+
| Custom Foods                       + Add Food        |
|------------------------------------------------------|
| Search ____________________________________________ |
|------------------------------------------------------|
| Homemade Curry                       Edit Delete     |
| Protein Shake                        Edit Delete     |
|------------------------------------------------------|
```

---

## Components

- Search
- Food List
- Nutrition Summary
- CRUD Buttons

---

# 14.10 Profile Screen

## Purpose

Displays and edits personal information.

---

## Layout

```
+------------------------------------------------------+
| Profile                                              |
|------------------------------------------------------|
| Name                                                 |
| Age                                                  |
| Gender                                               |
| Height                                               |
| Weight                                               |
| Activity Level                                       |
| Fitness Goal                                         |
|------------------------------------------------------|
| Daily Goals                                          |
| Calories                                             |
| Protein                                              |
| Carbs                                                |
| Fat                                                  |
| Water                                                |
|------------------------------------------------------|
| [ Save Changes ]                                    |
+------------------------------------------------------+
```

---

## Components

- Input Fields
- Dropdowns
- Goal Cards
- Save Button

---

# 14.11 Settings Screen

## Purpose

Allows users to configure application preferences.

---

## Layout

```
+------------------------------------------------------+
| Settings                                             |
|------------------------------------------------------|
| Appearance                                           |
| Theme                                                |
| Language                                             |
|------------------------------------------------------|
| Account                                              |
| Change Password                                      |
| Logout                                               |
|------------------------------------------------------|
| Data                                                 |
| Export PDF                                           |
|------------------------------------------------------|
| About                                                |
| Version                                              |
|------------------------------------------------------|
```

---

## Components

- Theme Switch
- Language Selector
- Password Button
- Export Button
- Logout Button

---

# Common Layout

Every authenticated page uses the same layout.

```
+--------------------------------------------------------------+
| Sidebar | Header                                             |
|---------|----------------------------------------------------|
|         | Breadcrumbs                                        |
|         |----------------------------------------------------|
|         |                                                    |
|         | Main Content                                       |
|         |                                                    |
|         |                                                    |
|--------------------------------------------------------------|
```

---

# Header

Contains:

- Page Title
- Search (future)
- Notifications (future)
- User Avatar

---

# Sidebar

Contains:

- Dashboard
- Meals
- Water
- Recipes
- Custom Foods
- Profile
- Settings
- Logout

---

# Cards

Cards should display:

- Rounded corners (12px)
- Soft shadow
- Consistent padding (24px)
- Hover effect
- Smooth transition (150–200ms)

---

# Buttons

Primary

- Green
- Filled

Secondary

- Blue
- Filled

Outline

- Transparent
- Border only

Danger

- Red

Disabled

- Grey

---

# Forms

Every form includes:

- Labels
- Placeholder text
- Validation messages
- Success feedback
- Error feedback
- Loading indicator

---

# Charts

Dashboard charts use:

- Weekly Calories
- Weekly Protein
- Macronutrient Distribution
- Water Progress

Library:

```
Recharts
```

---

# End of Part 3

Completed Screens

- Meal Details
- Water Tracking
- Recipes
- Custom Foods
- Profile
- Settings

# 15. Responsive Design

## Overview

NutriTrack is designed for both Web and Desktop platforms using a responsive layout system.

---

## Breakpoints

| Device | Width |
|----------|---------|
| Mobile | < 640px |
| Tablet | 640px – 1023px |
| Desktop | ≥ 1024px |

---

## Desktop Layout

```
+--------------------------------------------------------------+
| Sidebar | Header                                             |
|---------|----------------------------------------------------|
|         |                                                    |
|         | Main Content                                       |
|         |                                                    |
|--------------------------------------------------------------|
```

Sidebar remains fixed.

---

## Tablet Layout

```
+------------------------------------------------------+
| Header                                               |
|------------------------------------------------------|
| Collapsible Sidebar                                 |
|------------------------------------------------------|
| Main Content                                        |
+------------------------------------------------------+
```

Sidebar collapses into a drawer.

---

## Mobile Layout (Future)

```
Header

↓

Main Content

↓

Bottom Navigation
```

Version 1 primarily targets Desktop and Web.

---

# 16. Accessibility

NutriTrack follows modern accessibility practices.

## Guidelines

- Keyboard navigation supported
- Proper tab order
- High color contrast
- Accessible labels
- ARIA attributes where applicable
- Visible keyboard focus
- Large clickable buttons
- Semantic HTML elements

---

## Forms

Every form should include:

- Labels
- Placeholder text
- Validation messages
- Required field indicators

---

## Icons

Icons should never be the only indicator of meaning.

Always include accompanying text or tooltips.

---

# 17. Empty States

When no data is available, informative placeholders are shown.

---

## Meal History

```
🍽️

No meals logged yet.

Start by adding your first meal.

[ Add Meal ]
```

---

## Recipes

```
📖

No recipes created.

Create your first recipe.

[ New Recipe ]
```

---

## Custom Foods

```
🥗

No custom foods found.

[ Add Food ]
```

---

## Reports

```
📄

No report data available yet.

Track meals to generate reports.
```

---

# 18. Loading States

The application should always provide feedback while processing.

---

## Login

```
[ Logging in... ]
```

---

## Meal Analysis

```
Analyzing meal...

⏳
```

---

## Dashboard

Use Skeleton Loaders

```
██████████████

██████████████

██████████████
```

---

## Reports

```
Generating PDF...
```

---

# 19. Error States

Errors should be friendly and actionable.

---

## Network Error

```
Connection lost.

Please check your internet connection.

[ Retry ]
```

---

## AI Processing Error

```
We couldn't understand this meal.

Try describing it differently.

Example:

2 eggs
100g chicken
1 apple
```

---

## Validation Error

```
Weight must be greater than zero.
```

---

## Unauthorized

```
Your session has expired.

Please log in again.
```

---

## 404

```
Meal not found.
```

---

# 20. Success Messages

Examples

```
Meal added successfully.
```

```
Profile updated.
```

```
Water intake saved.
```

```
Recipe created.
```

```
PDF exported successfully.
```

Success notifications appear as toast messages.

---

# 21. Animations

Animations should be subtle and purposeful.

---

## Duration

150–250 milliseconds.

---

## Page Transition

Simple fade-in.

---

## Cards

Hover:

- Slight elevation
- Soft shadow

---

## Buttons

Hover:

- Slight brightness increase

Pressed:

- Small scale (98%)

---

## Charts

Charts animate only on initial load.

---

## Sidebar

Smooth expand/collapse transition.

---

## Loading Spinner

Simple rotating loader.

---

# 22. Theme Support

Version 1

- Dark Theme (Default)
- Light Theme (Optional)

Theme preference is saved locally.

---

# 23. UX Guidelines

The application should always:

- Minimize clicks
- Reduce typing
- Provide immediate feedback
- Prevent user errors
- Keep interfaces uncluttered
- Maintain consistency across screens

---

# 24. Future UI Improvements

Planned enhancements include:

- Mobile application
- Barcode scanner
- Voice meal logging
- Drag-and-drop meal planning
- AI chat assistant
- Interactive onboarding
- Advanced dashboard customization
- Widgets
- Wearable device integration

---

# 25. UI Component Inventory

| Component | Status |
|-----------|--------|
| Button | ✅ |
| Input | ✅ |
| Textarea | ✅ |
| Select | ✅ |
| Card | ✅ |
| Progress Bar | ✅ |
| Chart | ✅ |
| Table | ✅ |
| Modal | ✅ |
| Toast | ✅ |
| Dialog | ✅ |
| Calendar | ✅ |
| Badge | ✅ |
| Avatar | ✅ |
| Tooltip | ✅ |
| Skeleton Loader | ✅ |

---

# 26. Design Checklist

Before implementing any screen, verify:

- Consistent spacing
- Correct typography
- Accessible colors
- Responsive layout
- Proper validation
- Loading state
- Empty state
- Error state
- Success feedback
- Keyboard accessibility

---

# 27. Conclusion

The NutriTrack UI/UX is designed around simplicity, consistency, and usability.

The interface emphasizes fast meal logging, clear nutrition insights, and a distraction-free experience. By following a consistent design system, reusable components, and responsive layouts, the application will provide a professional user experience across both Web and Desktop platforms.

This document serves as the official UI/UX reference for NutriTrack Version 1.


# Prompt: Update NutriTrack UI/UX Design Document Using Reference Designs

You are a Senior Product Designer and Senior UX Architect with experience designing production-ready SaaS applications.

I already have an existing UI/UX documentation file for my project named **NutriTrack**.

Your task is **NOT** to rewrite the document from scratch.

Instead, carefully analyze the provided reference images, Figma designs, websites, or UI inspirations and update my existing UI/UX document while preserving its structure, consistency, and functionality.

## Project Context

Project Name: NutriTrack

Platform:

* Web Application
* Desktop Application (Electron)

Tech Stack:

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts
* FastAPI
* PostgreSQL

Current Design Philosophy:

* Simple
* Modern
* Minimal
* Professional
* Functional First
* Clean
* Responsive
* Portfolio Quality

This is **NOT** a mobile-first application.

Desktop and Web are the priority.

---

## Inputs I Will Provide

I may provide one or more of the following:

* Existing `06_UI_UX_Design.md`
* Figma links
* Screenshots
* Dribbble inspirations
* Behance projects
* Website screenshots
* UI kits
* Design systems
* Wireframes
* Color palettes

Treat these as inspiration only.

Do not copy any copyrighted design.

---

## Your Responsibilities

Study every reference carefully.

Identify improvements related to:

* Layout
* Hierarchy
* Navigation
* User Flow
* Visual Consistency
* Accessibility
* UX
* Responsiveness
* Component Design
* Dashboard Organization
* Forms
* Cards
* Tables
* Charts
* Empty States
* Loading States
* Error States
* Animations
* Color Usage
* Typography
* Whitespace

Then merge those improvements into my existing documentation.

---

## Preserve Existing Decisions

Do NOT change unless clearly justified:

* Project architecture
* Navigation hierarchy
* Functional requirements
* API assumptions
* Database assumptions
* User flows
* Design philosophy

Improve the presentation—not the business logic.

---

## Required Output

Return a complete updated version of `06_UI_UX_Design.md`.

Maintain Markdown formatting.

Maintain headings.

Maintain numbering.

Update only where improvements are beneficial.

If a new section is needed, insert it in the correct location.

---

## Add Professional Suggestions

Whenever appropriate, recommend improvements such as:

* Better dashboard layouts
* Better chart selection
* Better spacing
* Better typography
* Better accessibility
* Better component hierarchy
* Better form UX
* Better onboarding
* Better settings organization
* Better navigation
* Better empty states
* Better loading experiences

Explain why each improvement benefits the user experience.

---

## Component Recommendations

Recommend modern components from:

* shadcn/ui
* Lucide Icons
* Recharts

Only recommend components that fit the existing design philosophy.

---

## Quality Requirements

The final document should feel like it was written by a Senior Product Designer working at companies such as Linear, Notion, Vercel, Stripe, or GitHub.

The output should be:

* Clean
* Consistent
* Professional
* Easy to implement
* Portfolio quality
* Developer-friendly

---

## Important Rules

* Do not remove useful content.
* Improve rather than replace.
* Keep the document implementation-ready.
* Preserve Markdown formatting.
* Keep all diagrams in Markdown/ASCII format where applicable.
* Avoid unnecessary complexity.
* Every recommendation should have a practical UX reason.

The goal is to produce the best possible version of the UI/UX documentation while remaining faithful to the original NutriTrack vision.
