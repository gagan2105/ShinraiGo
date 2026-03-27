# Shinrai Go

Shinrai Go is a comprehensive web application designed to enhance safety and community engagement. It features a modern React frontend and a robust Node.js/Express backend, providing tools like interactive mapping, real-time alerts, and digital identity verification.

## Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS & Framer Motion for animations
- **Maps:** Leaflet & React-Leaflet
- **Data Visualization:** Recharts
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Firebase Admin SDK & JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (if running locally)
- Firebase project setup (for service account key & client config)

### 1. Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Variables

Create `.env` files for both the frontend and backend with your respective configuration (e.g., Firebase credentials, MongoDB URI, JWT secrets).

**Frontend (`.env`):**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# Add other Vite environment variables here
```

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Ensure your Firebase serviceAccountKey.json is placed in the server directory
```

### 3. Running the Application

You can run both the frontend and backend development servers.

**Start the Backend Server:**
```bash
cd server
npm start
```
*The server will typically run on `http://localhost:5000`.*

**Start the Frontend Development Server:**
```bash
# from the root directory
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

## Key Features
- **User & Admin Dashboards:** Dedicated interfaces for different user roles.
- **Interactive Geospatial Maps:** View and report incidents on a live map using OpenStreetMap and Leaflet.
- **Real-Time Alerts:** Stay informed with live notifications.
- **Digital ID:** Generation and management of secure digital identities with QR codes.

## Project Structure
- `/src` - React frontend source code (Pages, Components, Context, etc.)
- `/server` - Node.js/Express backend source code (Models, Controllers, Routes)
