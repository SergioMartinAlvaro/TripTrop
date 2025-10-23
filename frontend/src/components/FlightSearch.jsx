import { useState } from 'react';
import { useFlights } from '../hooks/useFlights';

export default function FlightSearch() {
  const { flights, loading, searchFlights } = useFlights();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
    passengers: 1,
    cabin_class: 'economy',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchFlights(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Flights</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
              From
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="origin"
              name="origin"
              type="text"
              placeholder="Origin Airport"
              value={formData.origin}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              To
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="destination"
              name="destination"
              type="text"
              placeholder="Destination Airport"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departure_date">
              Departure Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="departure_date"
              name="departure_date"
              type="date"
              value={formData.departure_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="return_date">
              Return Date (Optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="return_date"
              name="return_date"
              type="date"
              value={formData.return_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passengers">
              Passengers
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="passengers"
              name="passengers"
              type="number"
              min="1"
              value={formData.passengers}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cabin_class">
              Cabin Class
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cabin_class"
              name="cabin_class"
              value={formData.cabin_class}
              onChange={handleChange}
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </div>
      </form>

      {flights.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Flights</h2>
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{flight.airline}</h3>
                    <p className="text-gray-600">
                      {flight.origin} → {flight.destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Duration: {flight.duration}</p>
                    <p className="text-sm text-gray-500">Stops: {flight.stops === 0 ? 'Direct' : flight.stops}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary-600">
                      ${flight.price}
                    </p>
                    <p className="text-sm text-gray-500">{flight.cabin_class}</p>
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
