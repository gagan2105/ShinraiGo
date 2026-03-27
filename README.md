# 🛡️ Shinrai Go (SafeguardTour)

![Shinrai Go Banner](/public/shinrai_go_banner.png)


### Shaping the Future of Secure Tourism through AI & Blockchain.

**Shinrai Go** is a next-generation security platform designed to protect tourists and empower local authorities. By integrating real-time location tracking, IoT-driven safety scores, and a blockchain-verified digital identity, we create a "shield of safety" around travelers.

---

## 🌟 Key Features

### 🤳 1. Tourist Mobile Experience (Simulator)
- **Live Safety Score**: Real-time evaluation of the tourist's environment based on sensitivity, time, and crowd proximity.
- **One-Touch SOS**: An instant panic button that broadcasts location, identity, and emergency data to the central command.
- **AI Guide**: A conversational agent that provides safety advice, route checks, and local context.
- **Geofencing Alerts**: Automated notifications when approaching restricted zones (e.g., wildlife core areas).

### 👮 2. Central Police & Admin Command
- **Live Incident Feed**: Real-time visualization of SOS alerts and panic reports.
- **Anomaly Detection**: Advanced dashboard tracking irregular movements or departures from standard tourist routes.
- **Fleet Management**: Monitor authorized tourist groups across the geological map.

### 🆔 3. Blockchain Digital ID
- **Secure Minting**: Tourists generate a "Digital DNA" ID containing KYC, itinerary details, and medical info.
- **QR-Code Verification**: Seamless verification at checkpoints, hotels, and restricted entry points.
- **Tamper-Proof**: Verified data ensures identity is immutable and trustworthy.

---

## 🛠️ Technology Stack

### **Frontend (Vite + React)**
- **UI Architecture:** React 19 + Vite for ultra-fast performance.
- **Styling:** Tailwind CSS 4.0 + Framer Motion for premium, glassmorphic animations.
- **Data & Maps:** Leaflet.js + OpenStreetMap for live geospatial tracking.
- **Utility:** Lucide React (icons), Recharts (anomaly visualization), Sonner (notifications).

### **Backend (Node.js + Express)**
- **Runtime:** Node.js v18+.
- **Database:** MongoDB (via Mongoose) for persistent alert logs and user metadata.
- **Authentication:** Firebase Admin SDK (Token Verification) + Google Auth.
- **Real-time:** Native REST structure for high-performance mobile-to-server alerts.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **MongoDB**: A running instance (local or Atlas).
- **Firebase**: A project with a `serviceAccountKey.json` for the backend and client config for the frontend.

### 2. Installation

Clone and install dependencies for both layers:

```bash
# Root (Frontend)
npm install

# Server (Backend)
cd server
npm install
```

### 3. Configuration

**Frontend Setup**: Update `src/lib/firebase.js` with your Firebase client credentials.

**Backend Setup**: Place `serviceAccountKey.json` in the `/server` directory and optionally create a `.env`:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
```

### 4. Running Locally

**Start the Backend:**
```bash
cd server
npm start
```

**Start the Frontend:**
```bash
# from root
npm run dev
```
*Access the app at `http://localhost:5173`*

---

## 📁 Project Structure

```text
├── src/                    # React Frontend
│   ├── components/         # Reusable UI (Layouts, Auth, etc.)
│   ├── context/            # Global Auth & State (Context API)
│   ├── lib/                # Configs (Firebase, Axios)
│   └── pages/              # core Views (Simulator, Dashboards, ID)
├── server/                 # Node.js Backend
│   ├── config/             # Firebase Admin configuration
│   ├── models/             # Mongoose schemas (User, Feed, ID)
│   ├── routes/             # API Endpoints
│   └── server.js           # Server entry point
├── public/                 # Static assets
└── package.json            # Project manifest
```

---

## 🔒 Security & Privacy
Shinrai Go prioritizes data privacy. Live location data is only shared with authorized command centers when **Live Tracking** is toggled ON or when an **SOS** is triggered. All data transmissions are secured using Firebase ID Tokens and standard encryption.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed with ❤️ to make travel safer for everyone.*
