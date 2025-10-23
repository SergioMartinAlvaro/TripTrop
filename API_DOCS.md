# TripTrop API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All endpoints except `/auth/login` and `/auth/callback` require authentication.

### Headers
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Initiates Google OAuth2 login flow.

**Response:** Redirects to Google OAuth2 consent screen

#### GET /auth/callback
Handles OAuth2 callback from Google.

**Query Parameters:**
- `code`: Authorization code from Google

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### GET /auth/me
Get current authenticated user information.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "google_id": "123456789",
  "avatar_url": "https://...",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Flights

#### POST /flights/search
Search for flights.

**Request Body:**
```json
{
  "origin": "JFK",
  "destination": "LAX",
  "departure_date": "2024-06-01",
  "return_date": "2024-06-10",
  "passengers": 2,
  "cabin_class": "economy"
}
```

**Response:**
```json
{
  "flights": [
    {
      "id": "FL001",
      "airline": "Example Airlines",
      "origin": "JFK",
      "destination": "LAX",
      "departure_time": "2024-06-01T10:00:00",
      "arrival_time": "2024-06-01T14:00:00",
      "duration": "4h 00m",
      "price": 299.99,
      "currency": "USD",
      "stops": 0,
      "cabin_class": "economy"
    }
  ]
}
```

#### GET /flights/history
Get user's flight search history.

**Query Parameters:**
- `limit`: Number of results (default: 10)

**Response:**
```json
[
  {
    "id": "uuid",
    "search_type": "flight",
    "search_params": { ... },
    "results": { ... },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Hotels

#### POST /hotels/search
Search for hotels.

**Request Body:**
```json
{
  "destination": "Paris",
  "check_in": "2024-06-01",
  "check_out": "2024-06-05",
  "guests": 2,
  "rooms": 1
}
```

**Response:**
```json
{
  "hotels": [
    {
      "id": "HT001",
      "name": "Grand Plaza Hotel",
      "destination": "Paris",
      "rating": 4.5,
      "stars": 5,
      "price_per_night": 150.00,
      "currency": "USD",
      "amenities": ["WiFi", "Pool", "Gym"]
    }
  ]
}
```

### Experiences

#### POST /experiences/search
Search for activities and experiences.

**Request Body:**
```json
{
  "destination": "Paris",
  "date": "2024-06-01",
  "category": "tours"
}
```

**Response:**
```json
{
  "experiences": [
    {
      "id": "EXP001",
      "title": "City Walking Tour",
      "destination": "Paris",
      "category": "tours",
      "rating": 4.8,
      "reviews_count": 1250,
      "price": 45.00,
      "duration": "3 hours",
      "description": "Explore historic downtown"
    }
  ]
}
```

### Itineraries

#### POST /itineraries/generate
Generate AI-powered travel itinerary.

**Request Body:**
```json
{
  "destination": "Paris",
  "start_date": "2024-06-01",
  "end_date": "2024-06-05",
  "preferences": {
    "activities": ["culture", "food"],
    "pace": "relaxed"
  },
  "budget": "medium"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Trip to Paris",
  "destination": "Paris",
  "ai_content": {
    "overview": "A wonderful 5-day trip to Paris...",
    "days": [
      {
        "day": 1,
        "date": "2024-06-01",
        "activities": [
          {
            "time": "09:00",
            "title": "Visit Eiffel Tower",
            "description": "...",
            "cost": "30 EUR"
          }
        ]
      }
    ],
    "total_estimated_cost": "1200 EUR"
  }
}
```

#### GET /itineraries
List user's itineraries.

**Query Parameters:**
- `skip`: Offset (default: 0)
- `limit`: Limit (default: 10)

**Response:** Array of itinerary objects

#### GET /itineraries/{id}
Get specific itinerary details.

**Response:** Single itinerary object

#### PUT /itineraries/{id}
Update an itinerary.

**Request Body:** Partial itinerary object

#### DELETE /itineraries/{id}
Delete an itinerary.

**Response:**
```json
{
  "message": "Itinerary deleted successfully"
}
```

#### POST /itineraries/recommendations
Get destination recommendations based on preferences.

**Request Body:**
```json
{
  "preferences": {
    "climate": "warm",
    "activities": ["beach", "culture"]
  },
  "budget": "medium"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "destination": "Barcelona",
      "country": "Spain",
      "reasons": ["Great beaches", "Rich culture"],
      "best_time": "May-September",
      "daily_budget": "80-120 EUR"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Pagination

Endpoints that return lists support pagination:
- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum number of items to return (default: 10, max: 100)

## Data Types

- **UUID**: String in UUID v4 format
- **DateTime**: ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
- **JSONB**: Flexible JSON object structure
