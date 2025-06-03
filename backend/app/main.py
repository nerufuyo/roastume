from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api import router
from config.settings import settings
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="RoastUme API",
    description="CV Roasting Service - Get your resume reviewed with humor and constructive feedback",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True)


@app.on_event("startup")
async def startup_event():
    """Application startup event."""
    logger.info("RoastUme API starting up...")
    logger.info(f"Upload directory: {settings.upload_dir}")
    logger.info(f"Max file size: {settings.max_file_size} bytes")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event."""
    logger.info("RoastUme API shutting down...")
    # Cleanup resources
    from .core.review_manager import review_manager
    await review_manager.cleanup()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to RoastUme API 🔥",
        "description": "Upload your CV and get it roasted with constructive feedback!",
        "docs": "/docs"
    }
