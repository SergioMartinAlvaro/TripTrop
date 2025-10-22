"""
Hotel search routes.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.itinerary import SearchHistory
from app.schemas.itinerary import HotelSearchParams, SearchHistory as SearchHistorySchema

router = APIRouter()


@router.post("/search")
async def search_hotels(
    params: HotelSearchParams,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for hotels.
    
    Note: This is a placeholder. In production, integrate with hotel APIs
    like Booking.com, Expedia, or Hotels.com API.
    """
    # Mock hotel results
    mock_results = {
        "hotels": [
            {
                "id": "HT001",
                "name": "Grand Plaza Hotel",
                "destination": params.destination,
                "rating": 4.5,
                "stars": 5,
                "price_per_night": 150.00,
                "currency": "USD",
                "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
                "image_url": "https://example.com/hotel1.jpg",
                "check_in": params.check_in,
                "check_out": params.check_out
            },
            {
                "id": "HT002",
                "name": "Comfort Inn Downtown",
                "destination": params.destination,
                "rating": 4.0,
                "stars": 3,
                "price_per_night": 89.99,
                "currency": "USD",
                "amenities": ["WiFi", "Breakfast", "Parking"],
                "image_url": "https://example.com/hotel2.jpg",
                "check_in": params.check_in,
                "check_out": params.check_out
            }
        ],
        "search_params": params.dict()
    }
    
    # Save search history
    search_history = SearchHistory(
        user_id=current_user.id,
        search_type="hotel",
        search_params=params.dict(),
        results=mock_results
    )
    db.add(search_history)
    db.commit()
    
    return mock_results


@router.get("/history", response_model=List[SearchHistorySchema])
async def get_hotel_search_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get user's hotel search history."""
    searches = db.query(SearchHistory).filter(
        SearchHistory.user_id == current_user.id,
        SearchHistory.search_type == "hotel"
    ).order_by(SearchHistory.created_at.desc()).limit(limit).all()
    
    return searches
