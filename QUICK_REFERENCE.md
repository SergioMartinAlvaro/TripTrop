# TripTrop - Quick Reference Guide

## 🚀 Quick Start

### First Time Setup
```bash
# Clone and setup
git clone https://github.com/SergioMartinAlvaro/TripTrop.git
cd TripTrop
./setup.sh

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your credentials

# Start with Docker
docker-compose up
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔑 Essential URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

## 📋 Common Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload

# Database init
psql -U user -d triptrop -f migrations/db_init.sql

# Python shell
python -m IPython
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Rebuild containers
docker-compose build

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
```

## 🔐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/triptrop
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/callback
GEMINI_API_KEY=your-gemini-key
SECRET_KEY=your-secret-key-min-32-chars
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## 🛠️ Troubleshooting

### Backend Won't Start
1. Check Python version: `python --version` (need 3.11+)
2. Activate venv: `source venv/bin/activate`
3. Install deps: `pip install -r requirements.txt`
4. Check .env file exists
5. Verify database is running

### Frontend Won't Start
1. Check Node version: `node --version` (need 18+)
2. Remove node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Check port 5173 is free

### Database Connection Issues
1. Check PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
2. Verify database exists: `psql -l | grep triptrop`
3. Check DATABASE_URL in .env
4. Ensure user has permissions

### OAuth2 Issues
1. Verify redirect URI in Google Console matches exactly
2. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
3. Ensure CORS origins include your frontend URL
4. Clear browser cookies and try again

## 📚 API Quick Reference

### Authentication
```bash
# Login (browser)
GET http://localhost:8000/api/v1/auth/login

# Get current user
GET http://localhost:8000/api/v1/auth/me
Authorization: Bearer {token}
```

### Flights
```bash
# Search flights
POST http://localhost:8000/api/v1/flights/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "origin": "JFK",
  "destination": "LAX",
  "departure_date": "2024-06-01",
  "passengers": 2
}
```

### Generate Itinerary
```bash
POST http://localhost:8000/api/v1/itineraries/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination": "Paris",
  "start_date": "2024-06-01",
  "end_date": "2024-06-05",
  "budget": "medium"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest --cov=app               # With coverage
pytest tests/test_api.py       # Specific file
```

### Frontend Tests
```bash
cd frontend
npm test                       # Run tests
npm test -- --watch           # Watch mode
npm test -- --coverage        # With coverage
```

## 📦 Dependencies

### Add Backend Dependency
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

### Add Frontend Dependency
```bash
cd frontend
npm install package-name
# or for dev dependency
npm install -D package-name
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature

# Create Pull Request on GitHub
```

## 📖 Documentation Files

| File | Description |
|------|-------------|
| README.md | Main documentation and setup |
| API_DOCS.md | Complete API reference |
| CONTRIBUTING.md | Contribution guidelines |
| DEPLOYMENT.md | Production deployment guide |
| PROJECT_SUMMARY.md | Project overview and architecture |
| QUICK_REFERENCE.md | This file |

## 🆘 Getting Help

1. Check documentation files
2. Review API docs at /docs
3. Search closed GitHub issues
4. Open a new GitHub issue
5. Check logs: `docker-compose logs -f`

## ⚡ Pro Tips

- Use `setup.sh` for quick environment setup
- Run `docker-compose up` for easiest development
- Check `/docs` endpoint for interactive API testing
- Use environment variables for all config
- Keep dependencies updated for security
- Always backup database before migrations
- Test OAuth flow in incognito mode
- Use meaningful commit messages
- Write tests for new features
- Document API changes

## 🔗 Useful Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [Gemini AI](https://ai.google.dev/)

---

**Last Updated**: 2024
**Version**: 1.0.0
