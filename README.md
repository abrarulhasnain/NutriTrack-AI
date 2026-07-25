# NutriTrack

AI-powered nutrition tracking application.

## Status

🚧 In Development

## Features

- AI Meal Analysis
- Nutrition Tracking
- Personalized Goals
- Dashboard
- PDF Reports

## Tech Stack

Frontend:
- React
- TypeScript
- Tailwind CSS

Backend:
- FastAPI
- PostgreSQL

AI:
- OpenAI API

Desktop:
- Electron

Documentation:
- IEEE SRS
- IEEE SDD

## Architecture

NutriTrack follows a hybrid architecture.

- Supabase provides Authentication and managed PostgreSQL.
- FastAPI implements all business logic, AI integration, and nutrition calculations.
- React and Electron provide the user interface.

This allows the project to focus on its core value while using production-grade authentication infrastructure.