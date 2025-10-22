"""
Authentication routes for Google OAuth2.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.requests import Request

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.user import Token, User as UserSchema
from app.services.oauth_service import oauth, configure_oauth, get_google_user_info

router = APIRouter()

# Configure OAuth on startup
configure_oauth()


@router.get("/login")
async def login(request: Request):
    """Initiate Google OAuth2 login."""
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    """
    Handle Google OAuth2 callback.
    
    Creates or updates user in database and returns JWT token.
    """
    try:
        # Get token from Google
        token = await oauth.google.authorize_access_token(request)
        
        # Get user info from Google
        user_info = await get_google_user_info(token.get('access_token'))
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get user information from Google"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == user_info['email']).first()
        
        if not user:
            # Create new user
            user = User(
                email=user_info['email'],
                full_name=user_info.get('name'),
                google_id=user_info.get('id'),
                avatar_url=user_info.get('picture')
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user
            user.google_id = user_info.get('id')
            user.avatar_url = user_info.get('picture')
            user.full_name = user_info.get('name')
            db.commit()
        
        # Create JWT token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        # Redirect to frontend with token
        frontend_url = settings.BACKEND_CORS_ORIGINS[0] if settings.BACKEND_CORS_ORIGINS else "http://localhost:5173"
        return RedirectResponse(url=f"{frontend_url}/auth/callback?token={access_token}")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(
    current_user: User = Depends(get_db)
):
    """Get current user information."""
    return current_user


@router.post("/logout")
async def logout():
    """Logout user (client should delete token)."""
    return {"message": "Successfully logged out"}
