"""
API v1 router - combines all endpoint routers
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, subscriptions, dashboard

api_router = APIRouter()

# Include authentication endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Include subscription endpoints
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["Subscriptions"])

# Include dashboard endpoints
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
