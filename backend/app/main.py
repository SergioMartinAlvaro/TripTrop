"""
Main FastAPI application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.api.v1 import auth, flights, hotels, experiences, itineraries

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# Add session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(flights.router, prefix=f"{settings.API_V1_PREFIX}/flights", tags=["flights"])
app.include_router(hotels.router, prefix=f"{settings.API_V1_PREFIX}/hotels", tags=["hotels"])
app.include_router(experiences.router, prefix=f"{settings.API_V1_PREFIX}/experiences", tags=["experiences"])
app.include_router(itineraries.router, prefix=f"{settings.API_V1_PREFIX}/itineraries", tags=["itineraries"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to TripTrop API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_PREFIX}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
