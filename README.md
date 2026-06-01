# StockFlow — Inventory & Order Management System

A production-ready, fully containerized Inventory & Order Management System built with FastAPI, React, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Python 3.12 + FastAPI |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| Frontend Hosting | Vercel / Netlify |
| Backend Hosting | Render / Railway / Fly.io |

---

## Features

- **Product Management** — CRUD with SKU uniqueness, stock tracking, and low-stock alerts
- **Customer Management** — CRUD with unique email enforcement
- **Order Management** — Create orders with automatic inventory deduction and total calculation
- **Business Rules** — Cannot order more than available stock; stock restores on order cancellation
- **Dashboard** — Real-time stats: total products, customers, orders, and low-stock alerts
- **Responsive UI** — Dark-theme React SPA with clean, professional design

---

## Quick Start (Docker Compose)

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set a strong POSTGRES_PASSWORD
```

### 3. Start all services
```bash
docker compose up --build
```

### 4. Open the application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## Environment Variables

### Root `.env`
| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | — | **Required.** Database password |
| `POSTGRES_DB` | `inventory_db` | Database name |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |
| `VITE_API_URL` | `http://localhost:8000` | Backend URL for frontend (build-time) |

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create product |
| `GET` | `/products` | List all products |
| `GET` | `/products/{id}` | Get product by ID |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customers` | Create customer |
| `GET` | `/customers` | List all customers |
| `GET` | `/customers/{id}` | Get customer by ID |
| `DELETE` | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create order |
| `GET` | `/orders` | List all orders |
| `GET` | `/orders/{id}` | Get order by ID |
| `DELETE` | `/orders/{id}` | Cancel/delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Get summary stats |

---

## Deployment

### Backend — Render

1. Push the repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Set **Runtime**: Python, **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string (use Render's PostgreSQL add-on)
   - `ALLOWED_ORIGINS` — your frontend URL (e.g. `https://your-app.vercel.app`)

#### Or use Docker on Render:
1. Select **Docker** as environment
2. Point to `backend/Dockerfile`

### Backend — Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up --service backend
```

Set env vars via Railway dashboard or CLI.

### Frontend — Vercel

```bash
# Install Vercel CLI
npm install -g vercel
cd frontend
vercel
```

Set environment variable:
- `VITE_API_URL` = `https://your-backend.onrender.com`

Or deploy via Vercel dashboard → Import Git repo → set **Root Directory** to `frontend`.

### Frontend — Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli
cd frontend
netlify deploy --build
```

Set environment variable `VITE_API_URL` in Netlify dashboard → Site settings → Environment variables.

---

## Docker Hub

### Build and push the backend image

```bash
# Build
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-backend:latest ./backend

# Push
docker login
docker push YOUR_DOCKERHUB_USERNAME/inventory-backend:latest
```

### Use from Docker Hub

Update `docker-compose.yml` to use the published image:
```yaml
backend:
  image: YOUR_DOCKERHUB_USERNAME/inventory-backend:latest
```

---

## Development (without Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update DATABASE_URL to point to your local Postgres
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py        # Settings & env vars
│   │   │   └── database.py      # SQLAlchemy engine & session
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   ├── routes/
│   │   │   ├── products.py      # Product endpoints
│   │   │   ├── customers.py     # Customer endpoints
│   │   │   ├── orders.py        # Order endpoints
│   │   │   └── dashboard.py     # Dashboard stats endpoint
│   │   └── main.py              # FastAPI app entrypoint
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/              # Shared UI components + Layout
│   │   ├── lib/
│   │   │   └── api.js           # Axios API client
│   │   ├── pages/               # Route-level page components
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles & design tokens
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── .env.example
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Business Rules Implemented

| Rule | Implementation |
|------|---------------|
| Unique product SKU | DB unique constraint + 400 error on duplicate |
| Unique customer email | DB unique constraint + 400 error on duplicate |
| Non-negative product quantity | Pydantic validator |
| Insufficient stock blocks order | Pre-check with `SELECT FOR UPDATE` lock |
| Auto stock deduction on order | Atomic transaction in order creation |
| Auto total calculation | Backend computes `unit_price × quantity` |
| Stock restored on cancellation | Order DELETE endpoint restores inventory |

---

## Submission Checklist

- [ ] GitHub repository link
- [ ] Docker Hub image link: `docker.io/YOUR_USERNAME/inventory-backend:latest`
- [ ] Live frontend URL (Vercel/Netlify)
- [ ] Live backend API URL (Render/Railway)
