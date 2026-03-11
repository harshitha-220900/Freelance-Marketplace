"""
main.py – FastAPI application entry point.
Registers all routers, configures CORS, and creates tables on startup.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from config import settings
from database import create_tables

# Configure logging at the root level for the app
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ── Import routers from every module ──────────────────────────────────────────
from auth.routes import router as auth_router
from jobs.routes import router as jobs_router
from bids.routes import router as bids_router
from projects.routes import router as projects_router
from payments.routes import router as payments_router
from reviews.routes import router as reviews_router


# ── Lifespan: runs once at startup/shutdown ───────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables automatically on first run."""
    logger.info("Application starting up: creating tables if they don't exist...")
    await create_tables()
    logger.info("Application startup complete.")
    yield  # app runs here
    logger.info("Application shutting down...")


# ── Application instance ──────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="A beginner-friendly Freelance Marketplace REST API built with FastAPI.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Exception Handlers ────────────────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error for request {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal database error occurred."},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.critical(f"Unhandled exception on {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allows the React frontend to call the backend
# Using ["*"] in development to avoid CORS issues reported by the subagent
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ── Register routers ──────────────────────────────────────────────────────────
app.include_router(auth_router,     prefix="/auth",     tags=["Authentication"])
app.include_router(jobs_router,     prefix="/jobs",     tags=["Jobs"])
app.include_router(bids_router,     prefix="/bids",     tags=["Bids"])
app.include_router(projects_router, prefix="/projects", tags=["Projects"])
app.include_router(payments_router, prefix="/payments", tags=["Payments"])
app.include_router(reviews_router,  prefix="/reviews",  tags=["Reviews"])


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    """Service health validation endpoint."""
    return {"status": "ok", "service": settings.APP_NAME, "message": "API is operational"}

@app.get("/", tags=["Health"])
async def root():
    """Root redirect / sanity-check."""
    return {"message": "Welcome to the Freelance Marketplace API! Visit /docs for documentation."}
