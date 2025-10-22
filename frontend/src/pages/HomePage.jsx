import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user, login } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Welcome to TripTrop
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-Powered Travel Assistant
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Find the best flights, hotels, and experiences. Let our AI generate personalized 
          itineraries tailored to your preferences and budget.
        </p>
        
        {!user && (
          <button
            onClick={login}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
          >
            Get Started with Google
          </button>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold mb-2">Flight Search</h3>
          <p className="text-gray-600">
            Find the best flight deals from multiple airlines
          </p>
          {user && (
            <Link
              to="/flights"
              className="inline-block mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              Search Flights →
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold mb-2">Hotel Booking</h3>
          <p className="text-gray-600">
            Discover and book the perfect accommodation
          </p>
          {user && (
            <Link
              to="/hotels"
              className="inline-block mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              Search Hotels →
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold mb-2">Experiences</h3>
          <p className="text-gray-600">
            Explore unique activities and local experiences
          </p>
          {user && (
            <Link
              to="/experiences"
              className="inline-block mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              Find Experiences →
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI Itineraries</h3>
          <p className="text-gray-600">
            Let AI create personalized travel plans for you
          </p>
          {user && (
            <Link
              to="/generate"
              className="inline-block mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              Generate Itinerary →
            </Link>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50 rounded-lg px-8">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign In</h3>
            <p className="text-gray-600">
              Login with your Google account to get started
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search & Explore</h3>
            <p className="text-gray-600">
              Find flights, hotels, and activities for your trip
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Itinerary</h3>
            <p className="text-gray-600">
              Let AI create a personalized travel plan based on your preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
