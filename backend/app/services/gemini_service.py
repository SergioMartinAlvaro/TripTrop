"""
Gemini AI service for itinerary generation.
"""
import google.generativeai as genai
from typing import Dict, Any, Optional
from app.core.config import settings


class GeminiService:
    """Service for Gemini AI integration."""
    
    def __init__(self):
        """Initialize Gemini AI."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_itinerary(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        preferences: Optional[Dict[str, Any]] = None,
        budget: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a travel itinerary using Gemini AI.
        
        Args:
            destination: The travel destination
            start_date: Start date of the trip
            end_date: End date of the trip
            preferences: User preferences (activities, food, etc.)
            budget: Budget level (low, medium, high)
            
        Returns:
            Generated itinerary as a dictionary
        """
        # Build prompt
        prompt = f"""Generate a detailed travel itinerary for a trip to {destination} 
from {start_date} to {end_date}.

"""
        
        if budget:
            prompt += f"Budget level: {budget}\n"
        
        if preferences:
            prompt += f"Preferences: {preferences}\n"
        
        prompt += """
Please provide:
1. A day-by-day itinerary with suggested activities
2. Recommended times for each activity
3. Estimated costs for activities
4. Transportation recommendations between locations
5. Dining suggestions for each day
6. Local tips and cultural insights

Format the response as JSON with the following structure:
{
    "days": [
        {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
                {
                    "time": "HH:MM",
                    "title": "Activity name",
                    "description": "Description",
                    "duration": "Duration in hours",
                    "cost": "Estimated cost",
                    "location": "Location"
                }
            ],
            "meals": {
                "breakfast": "Suggestion",
                "lunch": "Suggestion", 
                "dinner": "Suggestion"
            },
            "tips": "Daily tips"
        }
    ],
    "overview": "Trip overview",
    "total_estimated_cost": "Total estimated cost",
    "packing_suggestions": ["item1", "item2"],
    "local_tips": ["tip1", "tip2"]
}
"""
        
        try:
            response = self.model.generate_content(prompt)
            # Parse the response
            import json
            # Try to extract JSON from the response
            text = response.text
            
            # Find JSON in the response
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                itinerary_data = json.loads(json_str)
            else:
                # If no JSON found, wrap the text response
                itinerary_data = {
                    "overview": text,
                    "days": [],
                    "raw_response": text
                }
            
            return itinerary_data
        except Exception as e:
            print(f"Error generating itinerary: {e}")
            return {
                "error": str(e),
                "overview": "Failed to generate itinerary. Please try again."
            }
    
    def get_destination_recommendations(
        self,
        preferences: Dict[str, Any],
        budget: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get destination recommendations based on user preferences.
        
        Args:
            preferences: User preferences
            budget: Budget level
            
        Returns:
            Recommended destinations
        """
        prompt = f"""Based on the following preferences, recommend 5 travel destinations:

Preferences: {preferences}
"""
        
        if budget:
            prompt += f"Budget: {budget}\n"
        
        prompt += """
For each destination, provide:
1. Destination name and country
2. Why it matches the preferences
3. Best time to visit
4. Estimated daily budget
5. Top 3 must-see attractions

Format as JSON array of destinations.
"""
        
        try:
            response = self.model.generate_content(prompt)
            import json
            text = response.text
            
            start_idx = text.find('[')
            end_idx = text.rfind(']') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                recommendations = json.loads(json_str)
            else:
                recommendations = [{"raw_response": text}]
            
            return {"recommendations": recommendations}
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return {"error": str(e), "recommendations": []}
