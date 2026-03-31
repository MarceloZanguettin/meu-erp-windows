# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React + Vite)
```bash
cd frontend
npm run dev       # Dev server with HMR
npm run build     # Production build to frontend/dist/
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Backend (FastAPI + Python)
```bash
cd backend
# Activate virtual environment first:
source ../venv/Scripts/activate   # Windows bash
python main.py    # Starts both FastAPI (port 8050) and Eel desktop window (port 8000)
```

### Running the full app
The desktop app is launched via `backend/main.py`, which starts two threads:
1. FastAPI/uvicorn on port 8050 (API)
2. Eel on port 8000 — loads the built frontend from `../frontend/dist/`

For development, run the frontend dev server separately with `npm run dev` and the backend with `python main.py`.

## Architecture

### Overview
This is a **desktop ERP application** built with:
- **Eel** — wraps the React frontend into a native desktop window (Chrome mode)
- **FastAPI** — REST API backend on port 8050
- **React + Vite** — frontend SPA
- **PostgreSQL** — database via SQLAlchemy ORM

### Window-Based Navigation
The frontend does **not use React Router**. Instead it implements a desktop-style multi-window UI:
- `App.jsx` maintains a `janelas` (windows) state array — each entry has `id`, `tipo`, `titulo`, `minimizada`
- Windows are rendered as draggable overlays using `react-draggable`
- `TaskBar` component shows minimized windows and allows restoring them
- New windows are opened from the `Header` dropdown menu

### Frontend State Management
- No global state library — uses React `useState` with prop drilling
- `App.jsx` is the root state container: manages `usuario` (authenticated user) and `janelas`
- Authentication flow: `LoginScreen` → POST `/api/login` → sets `usuario` state → renders main UI

### Backend MVC Structure
```
backend/
├── main.py              # App init, uvicorn + Eel threading
├── database.py          # SQLAlchemy engine, SessionLocal, Base
├── models/tabelas.py    # ORM models: Cliente, Produto, Pedido, ItemPedido, Usuario
├── controllers/         # FastAPI APIRouter instances (routes/handlers)
│   ├── auth_controller.py      # POST /api/login, GET /api/status
│   ├── pedido_controller.py    # POST /pedidos/
│   └── sistema_controller.py
└── schemas/             # Pydantic validation models
    ├── produto.py
    ├── pedido.py
    └── cliente.py
```

### Database
- PostgreSQL connection string in `backend/.env`: `DATABASE_URL=postgresql://postgres:marcelo123@localhost:5432/erp_db`
- Tables auto-created on startup via `Base.metadata.create_all()`
- Default login: `admin` / `admin`

### Component Structure
```
frontend/src/
├── App.jsx                          # Root: auth state + window management
└── components/
    ├── LoginScreen/                 # Login form
    ├── Header/                      # Nav bar with dropdown menus
    ├── TaskBar/                     # Minimized window tray
    └── ProductWindow/               # Product registration window
        └── abas/                    # Tabs: AbaDados, AbaTabelaPreco (+ placeholders)
```

### Styling
- Plain CSS files co-located with each component (no CSS modules, no Tailwind)
- Flexbox-based layouts
