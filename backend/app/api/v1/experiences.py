"""
Experience/activity search routes.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.itinerary import SearchHistory
from app.schemas.itinerary import ExperienceSearchParams, SearchHistory as SearchHistorySchema

router = APIRouter()


@router.post("/search")
async def search_experiences(
    params: ExperienceSearchParams,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for experiences and activities.
    
    Note: This is a placeholder. In production, integrate with activity APIs
    like Viator, GetYourGuide, or TripAdvisor.
    """
    # Mock experience results
    mock_results = {
        "experiences": [
            {
                "id": "EXP001",
                "title": "City Walking Tour",
                "destination": params.destination,
                "category": params.category or "tours",
                "rating": 4.8,
                "reviews_count": 1250,
                "price": 45.00,
                "currency": "USD",
                "duration": "3 hours",
                "description": "Explore the historic downtown area with a local guide",
                "image_url": "https://example.com/exp1.jpg"
            },
            {
                "id": "EXP002",
                "title": "Food Tasting Tour",
                "destination": params.destination,
                "category": "food",
                "rating": 4.9,
                "reviews_count": 890,
                "price": 75.00,
                "currency": "USD",
                "duration": "4 hours",
                "description": "Sample local cuisine at 5 authentic restaurants",
                "image_url": "https://example.com/exp2.jpg"
            },
            {
                "id": "EXP003",
                "title": "Museum Day Pass",
                "destination": params.destination,
                "category": "culture",
                "rating": 4.6,
                "reviews_count": 2100,
                "price": 35.00,
                "currency": "USD",
                "duration": "Full day",
                "description": "Access to 10+ museums and cultural sites",
                "image_url": "https://example.com/exp3.jpg"
            }
        ],
        "search_params": params.dict()
    }
    
    # Save search history
    search_history = SearchHistory(
        user_id=current_user.id,
        search_type="experience",
        search_params=params.dict(),
        results=mock_results
    )
    db.add(search_history)
    db.commit()
    
    return mock_results


@router.get("/history", response_model=List[SearchHistorySchema])
async def get_experience_search_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get user's experience search history."""
    searches = db.query(SearchHistory).filter(
        SearchHistory.user_id == current_user.id,
        SearchHistory.search_type == "experience"
    ).order_by(SearchHistory.created_at.desc()).limit(limit).all()
    
    return searches
