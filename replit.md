# SkillScope

## Overview
SkillScope is an educational resource discovery platform built with React, TypeScript, and Vite. The application helps users find educational videos and learning resources by searching YouTube and other platforms for high-quality educational content.

## Project Status
**Current State**: Successfully imported from GitHub and configured for Replit environment
**Last Updated**: November 23, 2025

## Tech Stack
- **Frontend Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS (loaded via CDN)

## Project Structure
```
/
├── components/          # React components (Header, Hero, Features, Card, BookSidebar, etc.)
├── pages/              # Page components (Home, Search, Results, Resources, About, Feedback)
├── services/           # API services (YouTube, Book APIs integration)
├── App.tsx             # Main application component with routing
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration (port 5000, allowedHosts enabled)
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## Recent Changes
- **2025-11-23**: Book Recommendation Sidebar Feature
  - Created bookService.ts with fallback logic: Google Books → OpenLibrary → Gutendex
  - Created BookSidebar component with dark theme styling (#1a1a1a background)
  - Integrated sidebar into Results page to show book recommendations
  - Sidebar appears on right side (280px fixed, full height)
  - Robust error handling with async/await and try/catch/finally
  - Sidebar updates automatically when search query changes

- **2025-11-23**: Initial Replit setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Enabled `allowedHosts: true` for Replit proxy compatibility
  - Added @vitejs/plugin-react for proper React support
  - Updated YouTube service to use environment variables for API keys
  - Created .env.local.example template for API keys

## API Keys Required
The application requires two API keys stored in environment variables:

1. **GEMINI_API_KEY**: For AI-powered features (optional)
2. **YOUTUBE_API_KEY**: For searching educational videos on YouTube

These should be set as secrets in Replit's environment configuration.

## Running the Project
The project runs automatically via the configured workflow:
- **Command**: `npm run dev`
- **Port**: 5000
- **URL**: Available through Replit's webview

## Development Notes
- The frontend is configured to allow all hosts to work with Replit's iframe proxy
- Vite dev server runs on 0.0.0.0:5000 for proper Replit integration
- YouTube API has a fallback hardcoded key for development (should be replaced with env var in production)
- The app filters YouTube results to show only educational content based on keywords

## User Preferences
None documented yet.

## Deployment
Ready for deployment via Replit's deployment feature. The build command is `npm run build` and outputs to the `dist` directory.
