"""
Google OAuth2 authentication service.
"""
from typing import Optional, Dict, Any
from authlib.integrations.starlette_client import OAuth
from app.core.config import settings


oauth = OAuth()


def configure_oauth():
    """Configure OAuth client."""
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )


async def get_google_user_info(token: str) -> Optional[Dict[str, Any]]:
    """
    Get user information from Google using OAuth token.
    
    Args:
        token: OAuth access token
        
    Returns:
        User information dictionary or None
    """
    import httpx
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if response.status_code == 200:
                return response.json()
            return None
    except Exception as e:
        print(f"Error getting Google user info: {e}")
        return None
