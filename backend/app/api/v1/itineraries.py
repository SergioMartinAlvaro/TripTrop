"""
Itinerary routes for AI-generated travel plans.
"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.itinerary import Itinerary
from app.schemas.itinerary import (
    Itinerary as ItinerarySchema,
    ItineraryCreate,
    ItineraryUpdate,
    AIItineraryRequest
)
from app.services.gemini_service import GeminiService

router = APIRouter()


@router.post("/generate")
async def generate_itinerary(
    request: AIItineraryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate an AI-powered travel itinerary using Gemini.
    """
    gemini_service = GeminiService()
    
    # Generate itinerary using Gemini AI
    ai_content = gemini_service.generate_itinerary(
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        preferences=request.preferences,
        budget=request.budget
    )
    
    # Create itinerary in database
    itinerary = Itinerary(
        user_id=current_user.id,
        title=f"Trip to {request.destination}",
        destination=request.destination,
        description=ai_content.get("overview", ""),
        ai_content=ai_content
    )
    
    db.add(itinerary)
    db.commit()
    db.refresh(itinerary)
    
    return itinerary


@router.get("", response_model=List[ItinerarySchema])
async def get_itineraries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    """Get user's itineraries."""
    itineraries = db.query(Itinerary).filter(
        Itinerary.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return itineraries


@router.get("/{itinerary_id}", response_model=ItinerarySchema)
async def get_itinerary(
    itinerary_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific itinerary."""
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == current_user.id
    ).first()
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    return itinerary


@router.post("", response_model=ItinerarySchema)
async def create_itinerary(
    itinerary_data: ItineraryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new itinerary manually."""
    itinerary = Itinerary(
        user_id=current_user.id,
        **itinerary_data.dict()
    )
    
    db.add(itinerary)
    db.commit()
    db.refresh(itinerary)
    
    return itinerary


@router.put("/{itinerary_id}", response_model=ItinerarySchema)
async def update_itinerary(
    itinerary_id: UUID,
    itinerary_data: ItineraryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an itinerary."""
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == current_user.id
    ).first()
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    # Update fields
    for field, value in itinerary_data.dict(exclude_unset=True).items():
        setattr(itinerary, field, value)
    
    db.commit()
    db.refresh(itinerary)
    
    return itinerary


@router.delete("/{itinerary_id}")
async def delete_itinerary(
    itinerary_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an itinerary."""
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == current_user.id
    ).first()
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    db.delete(itinerary)
    db.commit()
    
    return {"message": "Itinerary deleted successfully"}


@router.post("/recommendations")
async def get_recommendations(
    preferences: dict,
    budget: str = None,
    current_user: User = Depends(get_current_user)
):
    """Get destination recommendations based on preferences."""
    try:
        gemini_service = GeminiService()
        
        recommendations = gemini_service.get_destination_recommendations(
            preferences=preferences,
            budget=budget
        )
        
        return recommendations
    except Exception:
        # Don't expose internal error details
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate recommendations. Please try again later."
        )
