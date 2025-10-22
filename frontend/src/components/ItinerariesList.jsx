import { useEffect } from 'react';
import { useItineraries } from '../hooks/useItineraries';
import { Link } from 'react-router-dom';

export default function ItinerariesList() {
  const { itineraries, loading, fetchItineraries, deleteItinerary } = useItineraries();

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      await deleteItinerary(id);
    }
  };

  if (loading && itineraries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Itineraries</h1>
        <Link
          to="/generate"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
        >
          + Generate New
        </Link>
      </div>

      {itineraries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Itineraries Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start planning your next adventure with our AI-powered itinerary generator!
          </p>
          <Link
            to="/generate"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded"
          >
            Create Your First Itinerary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{itinerary.title}</h3>
                <p className="text-gray-600 mb-2">📍 {itinerary.destination}</p>
                {itinerary.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {itinerary.description}
                  </p>
                )}
                {itinerary.start_date && itinerary.end_date && (
                  <p className="text-sm text-gray-500 mb-4">
                    📅 {new Date(itinerary.start_date).toLocaleDateString()} -{' '}
                    {new Date(itinerary.end_date).toLocaleDateString()}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/itineraries/${itinerary.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    View Details →
                  </Link>
                  <button
                    onClick={() => handleDelete(itinerary.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
