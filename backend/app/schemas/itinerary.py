"""
Pydantic schemas for Itinerary and SearchHistory models.
"""
from datetime import datetime
from typing import Optional, Any, Dict
from uuid import UUID
from pydantic import BaseModel


class ItineraryBase(BaseModel):
    """Base itinerary schema."""
    title: str
    destination: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ItineraryCreate(ItineraryBase):
    """Schema for creating an itinerary."""
    ai_content: Optional[Dict[str, Any]] = None
    flights_data: Optional[Dict[str, Any]] = None
    hotels_data: Optional[Dict[str, Any]] = None
    experiences_data: Optional[Dict[str, Any]] = None


class ItineraryUpdate(BaseModel):
    """Schema for updating an itinerary."""
    title: Optional[str] = None
    destination: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    ai_content: Optional[Dict[str, Any]] = None
    flights_data: Optional[Dict[str, Any]] = None
    hotels_data: Optional[Dict[str, Any]] = None
    experiences_data: Optional[Dict[str, Any]] = None


class Itinerary(ItineraryBase):
    """Itinerary schema with all fields."""
    id: UUID
    user_id: UUID
    ai_content: Optional[Dict[str, Any]] = None
    flights_data: Optional[Dict[str, Any]] = None
    hotels_data: Optional[Dict[str, Any]] = None
    experiences_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class SearchHistoryBase(BaseModel):
    """Base search history schema."""
    search_type: str
    search_params: Dict[str, Any]


class SearchHistoryCreate(SearchHistoryBase):
    """Schema for creating search history."""
    results: Optional[Dict[str, Any]] = None


class SearchHistory(SearchHistoryBase):
    """Search history schema with all fields."""
    id: UUID
    user_id: UUID
    results: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class FlightSearchParams(BaseModel):
    """Flight search parameters."""
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: Optional[str] = "economy"


class HotelSearchParams(BaseModel):
    """Hotel search parameters."""
    destination: str
    check_in: str
    check_out: str
    guests: int = 1
    rooms: int = 1


class ExperienceSearchParams(BaseModel):
    """Experience search parameters."""
    destination: str
    date: Optional[str] = None
    category: Optional[str] = None


class AIItineraryRequest(BaseModel):
    """Request schema for AI itinerary generation."""
    destination: str
    start_date: str
    end_date: str
    preferences: Optional[Dict[str, Any]] = None
    budget: Optional[str] = None
