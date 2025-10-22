"""
Schemas initialization.
"""
from app.schemas.user import User, UserCreate, UserUpdate, Token, TokenData
from app.schemas.itinerary import (
    Itinerary,
    ItineraryCreate,
    ItineraryUpdate,
    SearchHistory,
    SearchHistoryCreate,
    FlightSearchParams,
    HotelSearchParams,
    ExperienceSearchParams,
    AIItineraryRequest,
)

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "Token",
    "TokenData",
    "Itinerary",
    "ItineraryCreate",
    "ItineraryUpdate",
    "SearchHistory",
    "SearchHistoryCreate",
    "FlightSearchParams",
    "HotelSearchParams",
    "ExperienceSearchParams",
    "AIItineraryRequest",
]
