"""
Flight search routes.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.itinerary import SearchHistory
from app.schemas.itinerary import FlightSearchParams, SearchHistory as SearchHistorySchema

router = APIRouter()


@router.post("/search")
async def search_flights(
    params: FlightSearchParams,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for flights.
    
    Note: This is a placeholder. In production, integrate with flight APIs
    like Amadeus, Skyscanner, or Google Flights API.
    """
    # Mock flight results
    mock_results = {
        "flights": [
            {
                "id": "FL001",
                "airline": "Example Airlines",
                "origin": params.origin,
                "destination": params.destination,
                "departure_time": f"{params.departure_date}T10:00:00",
                "arrival_time": f"{params.departure_date}T14:00:00",
                "duration": "4h 00m",
                "price": 299.99,
                "currency": "USD",
                "stops": 0,
                "cabin_class": params.cabin_class
            },
            {
                "id": "FL002",
                "airline": "Budget Air",
                "origin": params.origin,
                "destination": params.destination,
                "departure_time": f"{params.departure_date}T15:30:00",
                "arrival_time": f"{params.departure_date}T19:45:00",
                "duration": "4h 15m",
                "price": 199.99,
                "currency": "USD",
                "stops": 1,
                "cabin_class": params.cabin_class
            }
        ],
        "search_params": params.dict()
    }
    
    # Save search history
    search_history = SearchHistory(
        user_id=current_user.id,
        search_type="flight",
        search_params=params.dict(),
        results=mock_results
    )
    db.add(search_history)
    db.commit()
    
    return mock_results


@router.get("/history", response_model=List[SearchHistorySchema])
async def get_flight_search_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get user's flight search history."""
    searches = db.query(SearchHistory).filter(
        SearchHistory.user_id == current_user.id,
        SearchHistory.search_type == "flight"
    ).order_by(SearchHistory.created_at.desc()).limit(limit).all()
    
    return searches
