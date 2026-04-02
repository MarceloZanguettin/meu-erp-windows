# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React + Vite)
```bash
cd frontend
npm run dev       # Dev server with HMR on port 5173
npm run build     # Production build to frontend/dist/
npm run lint      # ESLint
```

### Backend (FastAPI + Python)
```bash
# Activate virtual environment first:
source venv/Scripts/activate   # Windows bash

cd backend
python main.py    # Starts FastAPI (port 8050) + Eel desktop window (port 8000)
python migrate.py # Apply schema migrations
```

### Seed data
```bash
cd backend
python seed_financeiro.py     # Seeds empresas, contas bancárias, contas a receber
python seed_contas_pagar.py   # Seeds contas a pagar
```

### Full startup (production mode)
```bash
python start.py   # Builds frontend, runs migrations, seeds, then starts the app
```

## Architecture

### Overview
Desktop ERP application built with:
- **Eel** — wraps the React frontend into a native desktop window (Chrome mode)
- **FastAPI** — REST API backend on port 8050
- **React 19 + Vite** — frontend SPA
- **PostgreSQL** — database via SQLAlchemy ORM

The backend runs two threads: FastAPI/uvicorn on port 8050 and Eel on port 8000 (loads `frontend/dist/`). For development, run the frontend dev server and backend separately.

### Window-Based Navigation
The frontend does **not use React Router**. It implements a desktop-style multi-window UI:
- `App.jsx` holds `janelas` state: `[{ id, tipo, minimizada }, ...]`
- Window lifecycle (open/close/minimize/restore) is managed by `src/hooks/useJanelas.js`
- `src/config/janelasConfig.js` is the central registry mapping `tipo → { titulo, Component }`
- Windows are draggable (`react-draggable`) and resizable (`src/hooks/useWindowResize.jsx`)
- `TaskBar` shows minimized windows; `Header` opens new ones

**To add a new window module:** create the component, add one entry to `janelasConfig.js`. No changes to `App.jsx` or `Header.jsx` needed.

### Component Pattern (complex modules)
Each feature window follows this internal structure:
```
ComponenteWindow/
├── index.jsx (or ComponenteWindow.jsx)   # Orchestrator — no logic, just layout
├── constants.js                          # Module config, empty form state (FORM_VAZIO)
├── hooks/useComponenteData.js            # All state, CRUD, modal control
├── services/componenteService.js         # Pure async functions wrapping axios calls
├── components/                           # Dumb sub-components (props only)
└── utils/                                # Pure helpers: formatters, date utils
```
Business logic lives in hooks; API calls live in services; components are stateless presentational.

### Backend Structure
```
backend/
├── main.py              # App init, uvicorn + Eel threading
├── database.py          # SQLAlchemy engine, SessionLocal, Base
├── migrate.py           # Schema migration helper
├── models/tabelas.py    # ORM models (see Database section)
├── controllers/         # FastAPI APIRouter instances
│   ├── auth_controller.py         # POST /api/login, GET /api/status
│   ├── pedido_controller.py       # POST /pedidos/
│   ├── financeiro_controller.py   # Full CRUD for financial entities
│   └── sistema_controller.py
├── schemas/             # Pydantic request/response models
└── services/            # Business logic separated from controllers
    └── pedido_service.py          # realizar_venda(): validates stock, persists order
```

### Database
- PostgreSQL connection string in `backend/.env`: `DATABASE_URL=postgresql://...`
- Tables auto-created on startup via `Base.metadata.create_all()`
- Default login: `admin` / `admin`
- ORM models in `backend/models/tabelas.py`:
  - Core: `Cliente`, `Produto`, `Pedido`, `ItemPedido`, `Usuario`
  - Financial: `Empresa` → (1:N) `ContaBancaria`, `ContaPagar`, `ContaReceber`

### Financial API (`/financeiro/`)
- `GET /financeiro/empresas`
- `GET|POST /financeiro/contas-bancarias`
- `GET|POST|PUT|PATCH|DELETE /financeiro/contas-pagar`
- `GET|POST|PUT|PATCH|DELETE /financeiro/contas-receber`
- Date range filtering via `?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD`
- `PATCH /financeiro/contas-pagar/{id}/pagar` — marks as paid
- `PATCH /financeiro/contas-receber/{id}/receber` — marks as received

### Frontend State Management
- No global state library — `useState` + prop drilling
- `App.jsx` owns `usuario` (auth) and `janelas` (window list); delegates window logic to `useJanelas`
- Auth flow: `LoginScreen` → POST `/api/login` → sets `usuario` → renders main UI

### Styling
- Plain CSS files co-located with each component (no CSS modules, no Tailwind)
- Flexbox-based layouts
