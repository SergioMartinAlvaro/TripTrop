#!/bin/bash
# Quick start script for development

set -e

echo "🚀 Starting TripTrop Application Setup"
echo "======================================"

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "⚠️  PostgreSQL client not found. Database setup may fail." >&2; }

echo "✅ Prerequisites check passed"

# Setup backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration!"
fi

cd ..

# Setup frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure backend/.env with your Google OAuth2 and Gemini API credentials"
echo "2. Set up PostgreSQL database and run: psql -U your_user -d triptrop -f backend/migrations/db_init.sql"
echo "3. Start the backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose: docker-compose up"
echo ""
echo "🌐 Access the application at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
