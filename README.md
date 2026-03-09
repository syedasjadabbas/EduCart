# EduCart Project

Quick Start guide to run both Backend and Frontend.

## 🚀 Recommended Start
Just double-click the **[start_educart.bat](./start_educart.bat)** file in this folder. It will:
1. Stop any old sessions.
2. Start the API (Port 5000).
3. Start the Website (Port 5173).
4. Auto-open your browser to `http://localhost:5173`.

## 🛠 Manual Start
If you prefer running via terminal:

### Backend
1. Open terminal in `backend` folder.
2. Run: `node server.js` (Port 5000).

### Frontend
1. Open terminal in `frontend` folder.
2. Run: `npm run dev` (Port 5173).

### 🚨 Common Fix: "Site Can't Be Reached"
- Ensure you are hitting **`http://localhost:5173`** (the new Vite port) and NOT `3000`.
- If a port is blocked, run the `.bat` script once to clear hung processes.
- If you see a Network Error in registration/login, confirm the backend is running.
