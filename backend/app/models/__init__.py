"""
Models initialization.
"""
from app.models.user import User
from app.models.itinerary import Itinerary, SearchHistory

__all__ = ["User", "Itinerary", "SearchHistory"]
