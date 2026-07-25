# Project Charter

## 1. Project Information

| Field | Value |
|-------|-------|
| **Project Name** | NutriTrack |
| **Project Type** | AI-Powered Nutrition Tracking Application |
| **Version** | 1.0 (MVP) |
| **Project Status** | Planning |
| **Start Date** | July 2026 |

---

# 2. Vision

NutriTrack aims to simplify nutrition tracking by allowing users to record meals in natural language and receive accurate nutritional analysis powered by artificial intelligence. The application helps users understand their daily nutritional intake, compare it with personalized goals, and make informed dietary decisions through a simple and intuitive experience.

---

# 3. Mission

To provide an accessible, AI-powered nutrition tracking platform that eliminates the need for manual food searches and complicated calorie logging, enabling users to focus on improving their health through personalized nutritional insights.

---

# 4. Problem Statement

Existing nutrition tracking applications often require users to manually search for foods, measure portions, and enter nutritional information, making the tracking process time-consuming and frustrating. Many advanced features are locked behind paid subscriptions. While large language models can estimate nutritional information, repeatedly writing prompts and manually tracking progress is inefficient. NutriTrack addresses these issues by combining AI-powered natural language understanding with automated nutrition tracking in a single application.

---

# 5. Objectives

### Primary Objectives

- Develop an AI-powered nutrition tracking application.
- Allow users to describe meals using natural language.
- Automatically calculate calories, protein, carbohydrates, fats, fiber, and sugar.
- Generate personalized daily nutrition goals based on user profile.
- Display daily nutrition progress through an interactive dashboard.
- Allow users to track their daily water intake.
- Export nutrition reports as PDF.

### Secondary Objectives

- Build a scalable architecture for future AI features.
- Create a clean and intuitive user interface.
- Maintain modular, well-documented, and maintainable code.

---

# 6. Target Audience

NutriTrack is intended for:

- Gym members
- Fitness enthusiasts
- Students
- Individuals pursuing weight loss or muscle gain
- Health-conscious users
- Anyone who wants to monitor daily nutrition without manual calculations

---

# 7. Scope

## In Scope (Version 1)

- User profile creation
- Personalized nutrition goal calculation
- Natural language meal input
- AI-powered meal analysis
- Daily nutrition dashboard
- Water intake tracking
- PDF report generation
- User account deletion
- Web application
- Desktop application

## Out of Scope (Version 1)

- Barcode scanning
- Meal photo recognition
- Voice input
- Exercise tracking
- Social features
- Notifications and reminders
- Mobile applications (Android/iOS)
- Nutritionist dashboard
- Multi-language support

---

# 8. Success Criteria

The project will be considered successful if:

- Users can create a profile in less than two minutes.
- Users can log meals using natural language.
- AI returns structured nutritional information accurately.
- Daily nutrition progress updates automatically.
- Users can export nutrition reports as PDF.
- The application provides a smooth and intuitive user experience.
- The architecture supports future feature expansion.

---

# 9. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript |
| Desktop | Electron |
| Styling | Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| AI | OpenAI API |
| Charts | Recharts |
| Version Control | Git + GitHub |
| Deployment | Docker |
| Auth & Database Hosting | Supabase |


---

# 10. Stakeholders

| Role | Name |
|------|------|
| Product Owner | Muhammad Abrar |
| Technical Architect | ChatGPT |
| End Users | General Public |

---

# 11. Risks

- AI may occasionally return inaccurate nutritional estimates.
- API usage costs may increase with heavy usage.
- Nutritional values depend on serving size accuracy.
- Internet connection is required for AI-powered analysis.
- Future API pricing changes may affect operational costs.

---

# 12. Future Vision

Future versions of NutriTrack may include:

- AI meal recommendations
- Food image recognition
- Barcode scanning
- Voice-based meal logging
- Weekly AI nutrition coach
- Smart grocery list generation
- Recipe recommendations
- Mobile applications
- Wearable device integration
- Exercise tracking
- Community features
- Advanced analytics and health insights