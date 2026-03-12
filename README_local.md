# Smart Kitchen Inventory Tracker

A full-stack application for tracking kitchen inventory, managing recipes, and receiving smart alerts.

## Project Structure

- **frontend/**: React application with Tailwind CSS (located in `my-app`)
- **backend/**: Node.js/Express server with MongoDB
- **utils/**: Utilities and helper scripts (e.g. schedulers)

## Getting Started

1. **Install Dependencies**
   - Root: `npm install`
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend/my-app && npm install`

2. **Run Server**
   - `cd backend && node server.js`

3. **Run Client**
   - `cd frontend/my-app && npm start`

## Features

- Item tracking and expiry alerts
- Recipe management
- AI-powered suggestions (Gemini integration)
- SMS notifications via scheduler
