# Servify Frontend

A production-grade React frontend for the Servify Spring Boot backend.

## Tech Stack
- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **STOMP.js + SockJS** — WebSocket real-time chat
- **Leaflet + OpenStreetMap** — interactive map with geolocation

---

## Folder Structure

```
src/
├── api/
│   ├── auth.js          # Login, register endpoints
│   ├── client.js        # Axios instance + JWT interceptor
│   └── users.js         # Users, skills, chatbot, validate
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx        # Sidebar + Outlet wrapper
│   │   ├── AppLayout.module.css
│   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   ├── Sidebar.jsx          # Nav sidebar
│   │   └── Sidebar.module.css
│   └── ui/
│       ├── Badge.jsx            # Badge, Card, Spinner, EmptyState
│       ├── Badge.module.css
│       ├── Button.jsx           # Reusable button
│       ├── Button.module.css
│       ├── Input.jsx            # Form input
│       └── Input.module.css
├── context/
│   └── AuthContext.jsx   # Global auth state (token, user, login, logout)
├── hooks/
│   ├── useGeolocation.js  # Browser Geolocation API wrapper
│   └── useWebSocket.js    # STOMP WebSocket (public + private channels)
├── pages/
│   ├── LoginPage.jsx      # /login
│   ├── RegisterPage.jsx   # /register (user or staff)
│   ├── Dashboard.jsx      # /dashboard — overview + quick actions
│   ├── MapPage.jsx        # /map — locate self + find nearby staff ⭐
│   ├── ChatPage.jsx       # /chat — public broadcast + private DM
│   ├── ChatbotPage.jsx    # /chatbot — AI assistant
│   ├── SkillsPage.jsx     # /skills — browse + add skills
│   ├── ProfilePage.jsx    # /profile — view profile + delete account
│   └── ValidatePage.jsx   # /validate — staff certificate validation
├── utils/
│   └── helpers.js         # JWT decode, date format, randomNearby util
├── App.jsx                # Route definitions
├── main.jsx               # Entry point
└── index.css              # Global styles + CSS variables
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Make sure your Spring Boot backend is running on `http://localhost:8080`.

---

## Key Features

### 🗺️ Map — Find Staff Near You (`/map`)
- Detects your location via the browser Geolocation API
- Reverse geocodes your address using Nominatim (OpenStreetMap)
- Shows your position with an accuracy circle on the map
- Select a skill type + describe your problem
- Fetches staff with that skill from the backend
- Plots staff markers near your location on the OpenStreetMap
- Click any staff card to fly the camera to their pin

### 💬 Chat (`/chat`)
- WebSocket via STOMP over SockJS
- Public channel: broadcast to all connected users
- Private DMs: send direct messages to specific users
- JWT auth is passed in the STOMP CONNECT headers

### 🤖 AI Assistant (`/chatbot`)
- Connects to the FastAPI service via your Spring Boot proxy
- Contextual conversation with typing indicators

### 🔐 Auth
- JWT stored in localStorage
- Axios interceptor adds `Authorization: Bearer <token>` to all requests
- Auto-redirects to `/login` on 401

---

## API Base URL
Configure in `vite.config.js` (proxied) or directly in `src/api/client.js`.
Default: `http://localhost:8080`
