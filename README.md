# FreelanceHub – Freelance Marketplace Platform

A beginner-friendly, industry-structured Fiverr-like marketplace where **clients** post jobs and **freelancers** bid to win projects.

Built with **FastAPI + React + SQLite/PostgreSQL** by a team of 6 students.

---

## 🏗️ Architecture

```
Browser → React (Vite, :5173) → FastAPI (:8000) → SQLite / PostgreSQL
```

- **Frontend**: React 18 + Vite + React Router v6 + Axios
- **Backend**: Python 3.12, FastAPI, SQLAlchemy (async), JWT auth
- **Database**: SQLite (dev, zero-config) or PostgreSQL (Docker)

## 📁 Project Structure

```
freelance-marketplace-platform/
├── backend/                   # FastAPI API server
│   ├── main.py                # App entry point, registers all routers
│   ├── database.py            # SQLAlchemy async engine + session
│   ├── config.py              # Environment-based config (pydantic-settings)
│   ├── requirements.txt       # Python dependencies
│   ├── auth/                  # Developer 1
│   ├── jobs/                  # Developer 2
│   ├── bids/                  # Developer 3
│   ├── projects/              # Developer 4
│   ├── payments/              # Developer 5
│   └── reviews/               # Developer 6
├── frontend/                  # React (Vite) app
│   ├── src/
│   │   ├── pages/             # 10 pages (one per feature)
│   │   ├── components/        # Navbar, JobCard, BidCard, ReviewCard
│   │   ├── services/api.js    # Centralised Axios API client
│   │   ├── context/           # AuthContext (user state + JWT)
│   │   ├── App.jsx            # Router + layout
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/schema.sql        # DDL for all 6 tables + seed data
├── docs/
│   ├── architecture.md        # System design explanation
│   └── github_workflow.md     # Collaboration guide
├── tests/                     # pytest integration tests
├── .env.example               # Environment variable template
└── docker-compose.yml         # One-command dev environment
```

---

## 🚀 Quick Start (Local, No Docker)

### Backend

```bash
cd backend

# 1. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy environment file
cp ../.env.example .env

# 4. Start the API server
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI – all 18 endpoints)
```

### Frontend

```bash
cd frontend

# 1. Install Node dependencies
npm install

# 2. Start Vite dev server
npm run dev
# → http://localhost:5173
```

---

## 🐳 Docker Quick Start

```bash
# One command to start everything
docker compose up --build

# Services:
#   Frontend  → http://localhost:5173
#   Backend   → http://localhost:8000
#   Database  → localhost:5432 (PostgreSQL)
```

---

## 📡 API Reference

All endpoints are documented at **http://localhost:8000/docs** (Swagger UI).

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account (client or freelancer) |
| POST | `/auth/login` | Login → returns JWT token |
| GET | `/auth/profile` | Get current user (requires token) |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobs` | Post a new job (client only) |
| GET | `/jobs` | List all jobs (filterable by status) |
| GET | `/jobs/{id}` | Get job details |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bids` | Submit a bid (freelancer only) |
| GET | `/bids/job/{job_id}` | Get bids on a job |
| PUT | `/bids/{id}/accept` | Accept a bid (client only) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project from accepted bid |
| GET | `/projects` | List my projects |
| POST | `/projects/{id}/submit-work` | Freelancer submits work |
| PUT | `/projects/{id}/approve` | Client approves work |

### Payments (Simulated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments` | Hold payment (escrow) |
| POST | `/payments/release/{project_id}` | Release to freelancer |
| GET | `/payments/history` | View transactions |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Post a review (after project completes) |
| GET | `/reviews/user/{user_id}` | Get reviews for a user |

---

## 🧪 Running Tests

```bash
cd backend
pytest ../tests/ -v

# Expected output:
#   tests/test_auth.py::test_register_client       PASSED
#   tests/test_auth.py::test_login_success          PASSED
#   tests/test_jobs.py::test_client_can_post_job    PASSED
#   ...
```

---
## 👥 Team Collaboration

This project is developed by a team of 6 members.  
Each member works on different modules using separate Git branches.

Branch naming convention used in this project:

member1  
member2  
member3  
member4  
member5  
member6  

Modules will be assigned and updated as development progresses.


See [docs/github_workflow.md](docs/github_workflow.md) for full collaboration guide.

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | All accounts (clients and freelancers) |
| `jobs` | Job postings created by clients |
| `bids` | Proposals submitted by freelancers |
| `projects` | Active work, created when a bid is accepted |
| `transactions` | Simulated payment records |
| `reviews` | Ratings after project completion |

---

## 🔗 Useful Links

- **Swagger UI** (interactive API docs): http://localhost:8000/docs
- **Architecture Guide**: [docs/architecture.md](docs/architecture.md)
- **GitHub Workflow**: [docs/github_workflow.md](docs/github_workflow.md)
