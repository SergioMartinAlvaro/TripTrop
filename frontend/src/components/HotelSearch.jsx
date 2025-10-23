import { useState } from 'react';
import { useHotels } from '../hooks/useHotels';

export default function HotelSearch() {
  const { hotels, loading, searchHotels } = useHotels();
  const [formData, setFormData] = useState({
    destination: '',
    check_in: '',
    check_out: '',
    guests: 1,
    rooms: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchHotels(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Hotels</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              Destination
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="destination"
              name="destination"
              type="text"
              placeholder="City or Hotel Name"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="check_in">
              Check-in Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="check_in"
              name="check_in"
              type="date"
              value={formData.check_in}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="check_out">
              Check-out Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="check_out"
              name="check_out"
              type="date"
              value={formData.check_out}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
              Guests
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="guests"
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rooms">
              Rooms
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="rooms"
              name="rooms"
              type="number"
              min="1"
              value={formData.rooms}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Hotels'}
          </button>
        </div>
      </form>

      {hotels.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Hotels</h2>
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{hotel.name}</h3>
                    <p className="text-yellow-500">{'★'.repeat(hotel.stars)}</p>
                    <p className="text-gray-600">{hotel.destination}</p>
                    <p className="text-sm text-gray-500">Rating: {hotel.rating}/5</p>
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Amenities:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {hotel.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-3xl font-bold text-primary-600">
                      ${hotel.price_per_night}
                    </p>
                    <p className="text-sm text-gray-500">per night</p>
                    <button className="mt-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
