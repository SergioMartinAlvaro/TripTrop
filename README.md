# TripTrop - AI Travel Assistant

✈️ A full-stack web application powered by Google AI that helps users find cheap flights, generate personalized travel itineraries, and get intelligent destination recommendations.

## 🚀 Features

- **Flight Search**: Find the best flight deals
- **Hotel Booking**: Discover and book accommodations
- **Experience Discovery**: Explore unique activities and local experiences
- **AI Itinerary Generation**: Get personalized travel plans powered by Gemini AI
- **Google OAuth2 Authentication**: Secure login with Google
- **Cloud Secret Manager Integration**: Secure credential management
- **PostgreSQL Database**: Robust data storage with UUID and JSONB support

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **Framework**: FastAPI
- **Database**: PostgreSQL (Cloud SQL) with SQLAlchemy ORM
- **Authentication**: Google OAuth2
- **AI**: Google Gemini AI for itinerary generation
- **Cloud**: Google Cloud Secret Manager for secure credential storage

### Frontend (React + Vite + Tailwind)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Google Cloud Project (for OAuth2 and Gemini AI)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SergioMartinAlvaro/TripTrop.git
cd TripTrop
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# - Google OAuth2 credentials
# - Gemini API key
# - Database credentials
# - Secret keys
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb triptrop

# Run initialization script
psql -U your_user -d triptrop -f migrations/db_init.sql
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env if needed
```

### 5. Google Cloud Configuration

#### OAuth2 Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8000/api/v1/auth/callback`
   - `http://localhost:5173/auth/callback`

#### Gemini AI Setup:
1. Enable Gemini API in Google Cloud Console
2. Generate API key
3. Add to `.env` file

#### Secret Manager (Optional):
1. Enable Secret Manager API
2. Create service account with Secret Manager permissions
3. Download service account key JSON
4. Set path in `GOOGLE_APPLICATION_CREDENTIALS`

## 🚀 Running the Application

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Start

#### Backend:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```
TripTrop/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py          # Authentication routes
│   │   │       ├── flights.py       # Flight search routes
│   │   │       ├── hotels.py        # Hotel search routes
│   │   │       ├── experiences.py   # Experience routes
│   │   │       └── itineraries.py   # AI itinerary routes
│   │   ├── core/
│   │   │   ├── config.py            # Configuration
│   │   │   ├── database.py          # Database setup
│   │   │   └── security.py          # Auth utilities
│   │   ├── models/
│   │   │   ├── user.py              # User model
│   │   │   └── itinerary.py         # Itinerary models
│   │   ├── schemas/
│   │   │   ├── user.py              # User schemas
│   │   │   └── itinerary.py         # Itinerary schemas
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Gemini AI integration
│   │   │   ├── oauth_service.py     # OAuth service
│   │   │   └── secret_manager.py    # Secret Manager service
│   │   └── main.py                  # FastAPI app
│   ├── migrations/
│   │   └── db_init.sql              # Database init script
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── hooks/                   # Custom hooks
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `GET /api/v1/auth/login` - Initiate Google OAuth2 login
- `GET /api/v1/auth/callback` - OAuth2 callback
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Flights
- `POST /api/v1/flights/search` - Search flights
- `GET /api/v1/flights/history` - Get search history

### Hotels
- `POST /api/v1/hotels/search` - Search hotels
- `GET /api/v1/hotels/history` - Get search history

### Experiences
- `POST /api/v1/experiences/search` - Search experiences
- `GET /api/v1/experiences/history` - Get search history

### Itineraries
- `POST /api/v1/itineraries/generate` - Generate AI itinerary
- `GET /api/v1/itineraries` - List user itineraries
- `GET /api/v1/itineraries/{id}` - Get specific itinerary
- `POST /api/v1/itineraries` - Create itinerary
- `PUT /api/v1/itineraries/{id}` - Update itinerary
- `DELETE /api/v1/itineraries/{id}` - Delete itinerary
- `POST /api/v1/itineraries/recommendations` - Get destination recommendations

## 🗄️ Database Schema

### Users Table
- UUID primary key
- Email (unique)
- Full name
- Google ID
- Avatar URL
- Timestamps

### Itineraries Table
- UUID primary key
- User ID (foreign key)
- Title, destination, description
- Start/end dates
- AI content (JSONB)
- Flight/hotel/experience data (JSONB)
- Timestamps

### Search History Table
- UUID primary key
- User ID (foreign key)
- Search type
- Search parameters (JSONB)
- Results (JSONB)
- Timestamp

## 🔒 Security Features

- JWT token-based authentication
- Google OAuth2 integration
- Cloud Secret Manager for sensitive data
- CORS configuration
- SQL injection protection (SQLAlchemy ORM)
- Password hashing (for future local auth)

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📚 Documentation

- Backend API docs: http://localhost:8000/docs (Swagger UI)
- Alternative docs: http://localhost:8000/redoc (ReDoc)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Sergio Martin Alvaro

## 🙏 Acknowledgments

- Google Gemini AI for itinerary generation
- FastAPI framework
- React and Vite teams
- Tailwind CSS

## 📧 Support

For issues and questions, please open an issue on GitHub.
