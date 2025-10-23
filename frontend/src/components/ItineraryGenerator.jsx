import { useState } from 'react';
import { useItineraries } from '../hooks/useItineraries';

export default function ItineraryGenerator() {
  const { currentItinerary, loading, generateItinerary } = useItineraries();
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    budget: 'medium',
    preferences: {
      activities: [],
      food_type: '',
      accommodation: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateItinerary(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Itinerary Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                Destination
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="destination"
                name="destination"
                type="text"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
                  Start Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
                  End Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                Budget Level
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="low">Budget-Friendly</option>
                <option value="medium">Moderate</option>
                <option value="high">Luxury</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating with AI...
                  </span>
                ) : (
                  '✨ Generate Itinerary'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div>
          {currentItinerary && currentItinerary.ai_content && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
              <h2 className="text-2xl font-bold mb-4">{currentItinerary.title}</h2>
              
              {currentItinerary.ai_content.overview && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-700">{currentItinerary.ai_content.overview}</p>
                </div>
              )}
              
              {currentItinerary.ai_content.days && currentItinerary.ai_content.days.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Day-by-Day Plan</h3>
                  <div className="space-y-4">
                    {currentItinerary.ai_content.days.map((day, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                        <h4 className="font-semibold text-primary-700">
                          Day {day.day} {day.date && `- ${day.date}`}
                        </h4>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-2 space-y-2">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="text-sm">
                                <span className="font-medium">{activity.time || 'TBD'}:</span>{' '}
                                {activity.title || activity.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentItinerary.ai_content.total_estimated_cost && (
                <div className="mb-4 p-4 bg-primary-50 rounded">
                  <p className="font-semibold">
                    Estimated Total Cost: {currentItinerary.ai_content.total_estimated_cost}
                  </p>
                </div>
              )}
              
              {currentItinerary.ai_content.raw_response && !currentItinerary.ai_content.days && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">AI Generated Plan</h3>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm">
                    {currentItinerary.ai_content.raw_response}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!currentItinerary && !loading && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to Plan Your Trip?
              </h3>
              <p className="text-gray-600">
                Fill in the form and let our AI create a personalized itinerary for you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
