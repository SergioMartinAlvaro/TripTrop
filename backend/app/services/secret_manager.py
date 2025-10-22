"""
Google Cloud Secret Manager integration.
"""
from typing import Optional
from google.cloud import secretmanager


class SecretManagerService:
    """Service for accessing Google Cloud Secret Manager."""
    
    def __init__(self, project_id: str):
        """Initialize Secret Manager client."""
        self.client = secretmanager.SecretManagerServiceClient()
        self.project_id = project_id
    
    def get_secret(self, secret_id: str, version: str = "latest") -> Optional[str]:
        """
        Retrieve a secret from Google Cloud Secret Manager.
        
        Args:
            secret_id: The ID of the secret to retrieve
            version: The version of the secret (default: "latest")
            
        Returns:
            The secret value as a string, or None if not found
        """
        try:
            name = f"projects/{self.project_id}/secrets/{secret_id}/versions/{version}"
            response = self.client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception:
            # Log error without exposing any secret-related information
            print("Error retrieving secret: Unable to access secret from Secret Manager")
            return None
    
    def create_secret(self, secret_id: str, secret_value: str) -> bool:
        """
        Create a new secret in Google Cloud Secret Manager.
        
        Args:
            secret_id: The ID for the new secret
            secret_value: The value to store
            
        Returns:
            True if successful, False otherwise
        """
        try:
            parent = f"projects/{self.project_id}"
            
            # Create the secret
            secret = self.client.create_secret(
                request={
                    "parent": parent,
                    "secret_id": secret_id,
                    "secret": {"replication": {"automatic": {}}},
                }
            )
            
            # Add the secret version
            self.client.add_secret_version(
                request={
                    "parent": secret.name,
                    "payload": {"data": secret_value.encode("UTF-8")},
                }
            )
            return True
        except Exception:
            # Log error without exposing any secret-related information
            print("Error creating secret: Unable to create secret in Secret Manager")
            return False
